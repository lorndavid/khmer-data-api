import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

def add_hyperlink(paragraph, url, text, color="0369A1", underline=True):
    part = paragraph.part
    r_id = part.relate_to(url, docx.opc.constants.RELATIONSHIP_TYPE.HYPERLINK, is_external=True)
    hyperlink = parse_xml(f'<w:hyperlink {nsdecls("w")} r:id="{r_id}" w:history="1" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"/>')
    new_run = parse_xml(f'<w:r {nsdecls("w")}/>')
    rPr = parse_xml(f'<w:rPr {nsdecls("w")}/>')
    if color:
        c = parse_xml(f'<w:color {nsdecls("w")} w:val="{color}"/>')
        rPr.append(c)
    if underline:
        u = parse_xml(f'<w:u {nsdecls("w")} w:val="single"/>')
        rPr.append(u)
    new_run.append(rPr)
    t = parse_xml(f'<w:t {nsdecls("w")}/>')
    t.text = text
    new_run.append(t)
    hyperlink.append(new_run)
    paragraph._p.append(hyperlink)

def create_document(output_path):
    doc = Document()

    # Set page margins: 0.75 in
    for s in doc.sections:
        s.top_margin = Inches(0.75)
        s.bottom_margin = Inches(0.75)
        s.left_margin = Inches(0.75)
        s.right_margin = Inches(0.75)

    # Clean White/Black Palette
    COLOR_PRIMARY = RGBColor(14, 116, 144)      # Deep Cyan / Teal
    COLOR_TITLE = RGBColor(15, 23, 42)          # Black / Dark Slate
    COLOR_TEXT = RGBColor(30, 41, 59)           # Slate 800
    COLOR_MUTED = RGBColor(100, 116, 139)       # Slate 500
    COLOR_CODE_BG = "F8FAFC"                    # Very light gray
    COLOR_BOX_BG = "FFFFFF"                     # Pure White
    COLOR_BORDER = "CBD5E1"                     # Slate 300
    COLOR_GREEN = RGBColor(22, 101, 52)         # Forest Green

    def format_run(run, font_name="Calibri", size_pt=11, bold=False, italic=False, color=COLOR_TEXT):
        run.font.name = font_name
        run.font.size = Pt(size_pt)
        run.bold = bold
        run.italic = italic
        run.font.color.rgb = color

    def add_code_box(doc, text):
        tbl = doc.add_table(rows=1, cols=1)
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        cell = tbl.cell(0, 0)
        cell.width = Inches(6.8)
        shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{COLOR_CODE_BG}"/>')
        cell._tc.get_or_add_tcPr().append(shd)
        borders = parse_xml(f'''
            <w:tcBorders {nsdecls("w")}>
                <w:top w:val="single" w:sz="4" w:space="0" w:color="{COLOR_BORDER}"/>
                <w:left w:val="single" w:sz="16" w:space="0" w:color="0E7490"/>
                <w:bottom w:val="single" w:sz="4" w:space="0" w:color="{COLOR_BORDER}"/>
                <w:right w:val="single" w:sz="4" w:space="0" w:color="{COLOR_BORDER}"/>
            </w:tcBorders>
        ''')
        cell._tc.get_or_add_tcPr().append(borders)
        p = cell.paragraphs[0]
        p.paragraph_format.space_before = Pt(4)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.left_indent = Inches(0.1)
        r = p.add_run(text)
        format_run(r, font_name="Consolas", size_pt=9.5, color=RGBColor(15, 23, 42))
        doc.add_paragraph().paragraph_format.space_after = Pt(2)

    def add_screenshot_placeholder(doc, label):
        tbl = doc.add_table(rows=1, cols=1)
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        cell = tbl.cell(0, 0)
        cell.width = Inches(6.8)
        cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER

        shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{COLOR_BOX_BG}"/>')
        cell._tc.get_or_add_tcPr().append(shd)
        
        borders = parse_xml(f'''
            <w:tcBorders {nsdecls("w")}>
                <w:top w:val="dashed" w:sz="8" w:space="0" w:color="{COLOR_BORDER}"/>
                <w:left w:val="dashed" w:sz="8" w:space="0" w:color="{COLOR_BORDER}"/>
                <w:bottom w:val="dashed" w:sz="8" w:space="0" w:color="{COLOR_BORDER}"/>
                <w:right w:val="dashed" w:sz="8" w:space="0" w:color="{COLOR_BORDER}"/>
            </w:tcBorders>
        ''')
        cell._tc.get_or_add_tcPr().append(borders)

        p = cell.paragraphs[0]
        p.alignment = PP_ALIGN_CENTER = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(26)
        p.paragraph_format.space_after = Pt(26)

        r_icon = p.add_run("📷  [ PASTE SCREENSHOT HERE ]\n")
        format_run(r_icon, font_name="Calibri", size_pt=11.5, bold=True, color=COLOR_PRIMARY)
        r_lbl = p.add_run(label)
        format_run(r_lbl, font_name="Calibri", size_pt=9.5, italic=True, color=COLOR_MUTED)

        doc.add_paragraph().paragraph_format.space_after = Pt(4)

    # ========================================================
    # TOP HEADER BOX (Student Info + Homework Title)
    # ========================================================
    tbl_top = doc.add_table(rows=1, cols=2)
    tbl_top.alignment = WD_TABLE_ALIGNMENT.CENTER
    c_info, c_title = tbl_top.cell(0, 0), tbl_top.cell(0, 1)
    c_info.width = Inches(3.2)
    c_title.width = Inches(3.6)

    borders_info = parse_xml(f'''
        <w:tcBorders {nsdecls("w")}>
            <w:top w:val="single" w:sz="8" w:space="0" w:color="64748B"/>
            <w:left w:val="single" w:sz="8" w:space="0" w:color="64748B"/>
            <w:bottom w:val="single" w:sz="8" w:space="0" w:color="64748B"/>
            <w:right w:val="single" w:sz="8" w:space="0" w:color="64748B"/>
        </w:tcBorders>
    ''')
    c_info._tc.get_or_add_tcPr().append(borders_info)
    shd_info = parse_xml(f'<w:shd {nsdecls("w")} w:fill="F8FAFC"/>')
    c_info._tc.get_or_add_tcPr().append(shd_info)

    p_info = c_info.paragraphs[0]
    p_info.paragraph_format.space_before = Pt(4)
    p_info.paragraph_format.space_after = Pt(4)
    r = p_info.add_run("Name: ")
    format_run(r, bold=True, size_pt=10.5)
    r2 = p_info.add_run("Lorn David\n")
    format_run(r2, size_pt=10.5)
    r3 = p_info.add_run("ID: ")
    format_run(r3, bold=True, size_pt=10.5)
    r4 = p_info.add_run("DIT2024139\n")
    format_run(r4, size_pt=10.5)
    r5 = p_info.add_run("Class: ")
    format_run(r5, bold=True, size_pt=10.5)
    r6 = p_info.add_run("PG-A")
    format_run(r6, size_pt=10.5)

    p_title = c_title.paragraphs[0]
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_before = Pt(14)
    r_t1 = p_title.add_run("HOMEWORK REPORT\n")
    format_run(r_t1, bold=True, size_pt=18, color=COLOR_TITLE)
    r_t2 = p_title.add_run("Docker Three Containers & Cloud Hosting")
    format_run(r_t2, bold=True, size_pt=10.5, color=COLOR_PRIMARY)

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

    # ========================================================
    # 1. HOMEWORK OVERVIEW & OBJECTIVES
    # ========================================================
    p = doc.add_paragraph()
    r = p.add_run("1. Homework Objectives & Assignment Scope")
    format_run(r, bold=True, size_pt=13, color=COLOR_TITLE)
    p.paragraph_format.space_before = Pt(6)
    p.paragraph_format.space_after = Pt(2)

    p = doc.add_paragraph()
    r = p.add_run("This assignment fulfills all requirements requested by the instructor:\n")
    format_run(r)
    r1 = p.add_run("• Requirement 1: ")
    format_run(r1, bold=True)
    r2 = p.add_run("Create 3 Docker Containers: 1.1 Database (PostgreSQL 16), 1.2 Backend (Node.js Express), 1.3 Frontend (Vue 3 + Nginx).\n")
    format_run(r2)
    r3 = p.add_run("• Requirement 2: ")
    format_run(r3, bold=True)
    r4 = p.add_run("Deploy to Cloud VPS with a custom domain, host the web application live, and run Nginx Proxy Manager on Docker.")
    format_run(r4)

    img_path = os.path.join(os.path.dirname(output_path), "architecture-overview.jpg")
    if os.path.exists(img_path):
        p_img = doc.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img.paragraph_format.space_before = Pt(6)
        p_img.paragraph_format.space_after = Pt(2)
        doc.add_picture(img_path, width=Inches(6.6))
        p_cap = doc.add_paragraph()
        p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r_cap = p_cap.add_run("Figure 1.1: System Architecture Diagram (Docker 3-Tier Containers & Cloud VPS Hosting)")
        format_run(r_cap, size_pt=9, italic=True, color=COLOR_MUTED)
        doc.add_paragraph().paragraph_format.space_after = Pt(4)
    else:
        add_screenshot_placeholder(doc, "Screenshot 1: Project Architecture / Dockerfiles in VS Code")

    # ========================================================
    # 2. REQUIREMENT 1: 3 DOCKER CONTAINERS
    # ========================================================
    p = doc.add_paragraph()
    r = p.add_run("2. Requirement 1: The 3 Docker Containers")
    format_run(r, bold=True, size_pt=13, color=COLOR_TITLE)
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.space_after = Pt(2)

    # 2.1 Database
    p = doc.add_paragraph()
    r = p.add_run("2.1 Database Container (PostgreSQL 16)")
    format_run(r, bold=True, size_pt=11.5, color=COLOR_PRIMARY)
    p.paragraph_format.space_before = Pt(4)
    p.paragraph_format.space_after = Pt(1)

    p = doc.add_paragraph()
    r = p.add_run("Image: ")
    format_run(r, bold=True)
    r2 = p.add_run("lorndavid/khmerapi-database:latest\n")
    format_run(r2)
    r3 = p.add_run("Stores all Cambodian administrative data (25 provinces, 210 districts, 1,661 communes, 14,528 villages). Runs on port 5432.")
    format_run(r3)

    add_code_box(doc, """# 1. Pull & Run Database Container
docker pull lorndavid/khmerapi-database:latest

docker network create khmerapi-net 2>/dev/null || true

docker run -d \\
  --name khmerapi-database \\
  --network khmerapi-net \\
  -e POSTGRES_USER=postgres \\
  -e POSTGRES_PASSWORD=postgrespassword \\
  -e POSTGRES_DB=khmerapi \\
  -p 5432:5432 \\
  lorndavid/khmerapi-database:latest""")

    add_screenshot_placeholder(doc, "Screenshot 2: Database Container Running / PostgreSQL Logs")

    # 2.2 Backend
    p = doc.add_paragraph()
    r = p.add_run("2.2 Backend REST API Container (Node.js Express + Prisma)")
    format_run(r, bold=True, size_pt=11.5, color=COLOR_PRIMARY)
    p.paragraph_format.space_before = Pt(6)
    p.paragraph_format.space_after = Pt(1)

    p = doc.add_paragraph()
    r = p.add_run("Image: ")
    format_run(r, bold=True)
    r2 = p.add_run("lorndavid/khmerapi-backend:latest\n")
    format_run(r2)
    r3 = p.add_run("Express REST API server connecting to the PostgreSQL database container. Exposes endpoints on port 4000.")
    format_run(r3)

    add_code_box(doc, """# 2. Pull & Run Backend Container
docker pull lorndavid/khmerapi-backend:latest

docker run -d \\
  --name khmerapi-backend \\
  --network khmerapi-net \\
  -p 4000:4000 \\
  -e DATABASE_URL=postgresql://postgres:postgrespassword@khmerapi-database:5432/khmerapi?schema=public \\
  lorndavid/khmerapi-backend:latest""")

    add_screenshot_placeholder(doc, "Screenshot 3: Backend API Health Check / JSON Response (/v1/provinces)")

    # 2.3 Frontend
    p = doc.add_paragraph()
    r = p.add_run("2.3 Frontend Web UI Container (Vue 3 + Nginx)")
    format_run(r, bold=True, size_pt=11.5, color=COLOR_PRIMARY)
    p.paragraph_format.space_before = Pt(6)
    p.paragraph_format.space_after = Pt(1)

    p = doc.add_paragraph()
    r = p.add_run("Image: ")
    format_run(r, bold=True)
    r2 = p.add_run("lorndavid/khmerapi-frontend:latest\n")
    format_run(r2)
    r3 = p.add_run("Interactive Vue 3 web interface and API explorer served via Nginx on port 80.")
    format_run(r3)

    add_code_box(doc, """# 3. Pull & Run Frontend Container
docker pull lorndavid/khmerapi-frontend:latest

docker run -d \\
  --name khmerapi-frontend \\
  --network khmerapi-net \\
  -p 80:80 \\
  lorndavid/khmerapi-frontend:latest""")

    add_screenshot_placeholder(doc, "Screenshot 4: Frontend Website Interface running on http://localhost")

    # 2.4 Verification
    p = doc.add_paragraph()
    r = p.add_run("2.4 Verification: All 3 Containers Running")
    format_run(r, bold=True, size_pt=11.5, color=COLOR_PRIMARY)
    p.paragraph_format.space_before = Pt(6)
    p.paragraph_format.space_after = Pt(1)

    add_code_box(doc, """# Check all running containers
docker ps""")

    add_screenshot_placeholder(doc, "Screenshot 5: Terminal Output of 'docker ps' showing all 3 containers UP")

    # ========================================================
    # 3. REQUIREMENT 2: SELF-HOSTED SERVER, DOMAIN & NGINX PROXY MANAGER
    # ========================================================
    p = doc.add_paragraph()
    r = p.add_run("3. Requirement 2: Self-Hosted Server, Free Domain & Nginx Proxy Manager")
    format_run(r, bold=True, size_pt=13, color=COLOR_TITLE)
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.space_after = Pt(2)

    p = doc.add_paragraph()
    r = p.add_run("• Self-Hosted Server: ")
    format_run(r, bold=True)
    r = p.add_run("Dedicated machine running Ubuntu 24.04 LTS with Docker Engine.\n")
    format_run(r)
    r = p.add_run("• Remote Management: ")
    format_run(r, bold=True)
    r = p.add_run("Tailscale Mesh VPN for secure remote SSH administration from anywhere.\n")
    format_run(r)
    r = p.add_run("• Domain & Public Access: ")
    format_run(r, bold=True)
    r = p.add_run("Domain lorndavid.online securely exposed via Cloudflare Tunnel with automated HTTPS SSL.\n")
    format_run(r)

    add_screenshot_placeholder(doc, "Screenshot 6: Tailscale / Server Terminal & Cloudflare Tunnel Dashboard")

    p = doc.add_paragraph()
    r = p.add_run("• Running Nginx Proxy Manager on Docker:")
    format_run(r, bold=True, color=COLOR_PRIMARY)
    p.paragraph_format.space_before = Pt(4)

    add_code_box(doc, """# Run Nginx Proxy Manager on Self-Hosted Server
docker run -d \\
  --name nginx-proxy-manager \\
  --restart always \\
  -p 8081:80 \\
  -p 81:81 \\
  -p 8443:443 \\
  -v npm_data:/data \\
  -v npm_letsencrypt:/etc/letsencrypt \\
  jc21/nginx-proxy-manager:latest""")

    add_screenshot_placeholder(doc, "Screenshot 7: Nginx Proxy Manager Admin Dashboard (Port 81)")

    # ========================================================
    # 4. LIVE PRODUCTION LINKS & TESTING
    # ========================================================
    p = doc.add_paragraph()
    r = p.add_run("4. Live Production Results & Links")
    format_run(r, bold=True, size_pt=13, color=COLOR_TITLE)
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.space_after = Pt(2)

    p_links = doc.add_paragraph()
    r = p_links.add_run("• Live Frontend Web UI: ")
    format_run(r, bold=True)
    add_hyperlink(p_links, "https://khmer.lorndavid.online", "https://khmer.lorndavid.online")
    r = p_links.add_run("\n• Live REST API All Provinces: ")
    format_run(r, bold=True)
    add_hyperlink(p_links, "https://khmerapi.lorndavid.online/v1/provinces", "https://khmerapi.lorndavid.online/v1/provinces")
    r = p_links.add_run("\n• Docker Hub Repositories: ")
    format_run(r, bold=True)
    add_hyperlink(p_links, "https://hub.docker.com/u/lorndavid", "https://hub.docker.com/u/lorndavid")

    add_screenshot_placeholder(doc, "Screenshot 8: Live Website in Browser with HTTPS SSL Padlock")

    # ========================================================
    # 5. CONCLUSION & THANK YOU
    # ========================================================
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(14)
    r = p.add_run("5. Summary of Completed Objectives\n")
    format_run(r, bold=True, size_pt=13, color=COLOR_TITLE)

    summary_items = [
        "✅ 1.1 Database Container (PostgreSQL 16) created, configured, and pushed to Docker Hub.",
        "✅ 1.2 Backend REST API Container (Node.js) created, configured, and pushed to Docker Hub.",
        "✅ 1.3 Frontend Web UI Container (Vue 3) created, configured, and pushed to Docker Hub.",
        "✅ 2.1 Free Domain and Cloud VPS configured with DNS A-Records.",
        "✅ 2.2 Nginx Proxy Manager container running with automated SSL encryption."
    ]
    for it in summary_items:
        p_it = doc.add_paragraph()
        p_it.paragraph_format.left_indent = Inches(0.2)
        p_it.paragraph_format.space_after = Pt(2)
        r = p_it.add_run(it)
        format_run(r, color=COLOR_TEXT)

    p_ty = doc.add_paragraph()
    p_ty.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_ty.paragraph_format.space_before = Pt(30)
    p_ty.paragraph_format.space_after = Pt(12)
    r_ty = p_ty.add_run("THANK YOU")
    format_run(r_ty, font_name="Calibri", size_pt=26, bold=True, color=COLOR_GREEN)

    try:
        doc.save(output_path)
        print(f"Document saved successfully to: {output_path}")
    except PermissionError:
        alt_path = output_path.replace(".docx", "-Final.docx")
        doc.save(alt_path)
        print(f"File was open in Word. Saved to alternative path: {alt_path}")

if __name__ == "__main__":
    out = r"d:\Developer Project\homework\Homework-Docker-Report.docx"
    create_document(out)

