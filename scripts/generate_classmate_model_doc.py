import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

def add_hyperlink(paragraph, url, text, color="1679AB", underline=True):
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

def create_model_docx(output_path):
    doc = Document()

    # Margins: 0.75 in
    for s in doc.sections:
        s.top_margin = Inches(0.75)
        s.bottom_margin = Inches(0.75)
        s.left_margin = Inches(0.75)
        s.right_margin = Inches(0.75)

    COLOR_TITLE = RGBColor(15, 52, 96)       # Deep Navy
    COLOR_HEADING = RGBColor(22, 121, 171)   # Blue Accent
    COLOR_TEXT = RGBColor(30, 41, 59)        # Slate Dark
    COLOR_MUTED = RGBColor(100, 116, 139)    # Muted Gray
    COLOR_CODE_BG = "F1F5F9"
    COLOR_PLACEHOLDER_BG = "F8FAFC"

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
                <w:top w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/>
                <w:left w:val="single" w:sz="16" w:space="0" w:color="1679AB"/>
                <w:bottom w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/>
                <w:right w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/>
            </w:tcBorders>
        ''')
        cell._tc.get_or_add_tcPr().append(borders)
        p = cell.paragraphs[0]
        p.paragraph_format.space_before = Pt(4)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.left_indent = Inches(0.1)
        r = p.add_run(text)
        format_run(r, font_name="Consolas", size_pt=9.5, color=RGBColor(30, 41, 59))
        doc.add_paragraph().paragraph_format.space_after = Pt(2)

    def add_screenshot_placeholder(doc, label):
        """Creates a dedicated visual box for pasting screenshots."""
        tbl = doc.add_table(rows=1, cols=1)
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        cell = tbl.cell(0, 0)
        cell.width = Inches(6.8)
        cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER

        shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{COLOR_PLACEHOLDER_BG}"/>')
        cell._tc.get_or_add_tcPr().append(shd)
        
        # Dashed border
        borders = parse_xml(f'''
            <w:tcBorders {nsdecls("w")}>
                <w:top w:val="dashed" w:sz="8" w:space="0" w:color="94A3B8"/>
                <w:left w:val="dashed" w:sz="8" w:space="0" w:color="94A3B8"/>
                <w:bottom w:val="dashed" w:sz="8" w:space="0" w:color="94A3B8"/>
                <w:right w:val="dashed" w:sz="8" w:space="0" w:color="94A3B8"/>
            </w:tcBorders>
        ''')
        cell._tc.get_or_add_tcPr().append(borders)

        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(22)
        p.paragraph_format.space_after = Pt(22)

        r_icon = p.add_run("📷 [ PASTE SCREENSHOT HERE ]\n")
        format_run(r_icon, font_name="Calibri", size_pt=11, bold=True, color=COLOR_HEADING)
        r_lbl = p.add_run(label)
        format_run(r_lbl, font_name="Calibri", size_pt=9.5, italic=True, color=COLOR_MUTED)

        doc.add_paragraph().paragraph_format.space_after = Pt(4)

    # -------------------------------------------------------------
    # 1. HEADER (Top Left Box + Centered Title)
    # -------------------------------------------------------------
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
    r_t1 = p_title.add_run("Homework Report\n")
    format_run(r_t1, bold=True, size_pt=18, color=COLOR_TITLE)
    r_t2 = p_title.add_run("Docker Three Containers (DB + Backend + Frontend)")
    format_run(r_t2, bold=True, size_pt=10.5, color=COLOR_HEADING)

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

    # -------------------------------------------------------------
    # 1. HOMEWORK OBJECTIVES (Like classmate model)
    # -------------------------------------------------------------
    p = doc.add_paragraph()
    r = p.add_run("1. Homework Objective & Overview")
    format_run(r, bold=True, size_pt=13, color=COLOR_TITLE)
    p.paragraph_format.space_before = Pt(6)
    p.paragraph_format.space_after = Pt(2)

    p = doc.add_paragraph()
    r = p.add_run("Build 3 independent Docker containers for the Backend system that connects to the Database and Frontend UI. This project consists of ")
    format_run(r)
    r2 = p.add_run("3 Docker Images: Database, Backend API, and Frontend Web UI")
    format_run(r2, bold=True, color=COLOR_HEADING)
    r3 = p.add_run(". All 3 images are pushed to Docker Hub so they can be pulled and executed on any computer or Docker Desktop.")
    format_run(r3)

    add_screenshot_placeholder(doc, "Screenshot 1: Project Folder Structure & Dockerfiles in VS Code")

    # -------------------------------------------------------------
    # 2. THE 3 DOCKER CONTAINERS
    # -------------------------------------------------------------
    p = doc.add_paragraph()
    r = p.add_run("2. The 3 Docker Containers & Build Commands")
    format_run(r, bold=True, size_pt=13, color=COLOR_TITLE)
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.space_after = Pt(2)

    # 2.1 Database
    p = doc.add_paragraph()
    r = p.add_run("2.1 Database Container: ")
    format_run(r, bold=True, size_pt=11.5, color=COLOR_HEADING)
    r2 = p.add_run("lorndavid/khmerapi-database:latest")
    format_run(r2, bold=True)
    p.paragraph_format.space_before = Pt(4)
    p.paragraph_format.space_after = Pt(1)

    p = doc.add_paragraph()
    r = p.add_run("Runs PostgreSQL 16 on Alpine Linux to store complete Cambodian geography and population datasets.")
    format_run(r)

    add_code_box(doc, """# Pull base image, tag, and push to Docker Hub
docker pull postgres:16-alpine
docker tag postgres:16-alpine lorndavid/khmerapi-database:latest
docker push lorndavid/khmerapi-database:latest

# Pull command for testing on other machines:
docker pull lorndavid/khmerapi-database:latest""")

    add_screenshot_placeholder(doc, "Screenshot 2: Database Image Build / Tag & Docker Images List")

    # 2.2 Backend
    p = doc.add_paragraph()
    r = p.add_run("2.2 Backend REST API Container: ")
    format_run(r, bold=True, size_pt=11.5, color=COLOR_HEADING)
    r2 = p.add_run("lorndavid/khmerapi-backend:latest")
    format_run(r2, bold=True)
    p.paragraph_format.space_before = Pt(6)
    p.paragraph_format.space_after = Pt(1)

    p = doc.add_paragraph()
    r = p.add_run("Node.js Express REST API server built with Prisma ORM. Connects to database on port 4000.")
    format_run(r)

    add_code_box(doc, """# Build image from Dockerfile.backend, tag, and push
docker build -t lorndavid/khmerapi-backend:latest -f Dockerfile.backend .
docker push lorndavid/khmerapi-backend:latest

# Pull command:
docker pull lorndavid/khmerapi-backend:latest""")

    add_screenshot_placeholder(doc, "Screenshot 3: Backend Dockerfile & Build Output")

    # 2.3 Frontend
    p = doc.add_paragraph()
    r = p.add_run("2.3 Frontend Web Application Container: ")
    format_run(r, bold=True, size_pt=11.5, color=COLOR_HEADING)
    r2 = p.add_run("lorndavid/khmerapi-frontend:latest")
    format_run(r2, bold=True)
    p.paragraph_format.space_before = Pt(6)
    p.paragraph_format.space_after = Pt(1)

    p = doc.add_paragraph()
    r = p.add_run("Vue 3 interactive web application served via Nginx on port 80 with built-in API proxy.")
    format_run(r)

    add_code_box(doc, """# Build frontend image from frontend/Dockerfile, tag, and push
docker build -t lorndavid/khmerapi-frontend:latest -f frontend/Dockerfile frontend
docker push lorndavid/khmerapi-frontend:latest

# Pull command:
docker pull lorndavid/khmerapi-frontend:latest""")

    add_screenshot_placeholder(doc, "Screenshot 4: Frontend Dockerfile & Build Output")

    # -------------------------------------------------------------
    # 3. VERIFIED DOCKER HUB REPOSITORIES
    # -------------------------------------------------------------
    p = doc.add_paragraph()
    r = p.add_run("3. All 3 Containers Published on Docker Hub")
    format_run(r, bold=True, size_pt=13, color=COLOR_TITLE)
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.space_after = Pt(2)

    p = doc.add_paragraph()
    r = p.add_run("• Docker Hub Profile: ")
    format_run(r, bold=True)
    add_hyperlink(p, "https://hub.docker.com/u/lorndavid", "https://hub.docker.com/u/lorndavid")

    add_screenshot_placeholder(doc, "Screenshot 5: Docker Hub Repositories Page (showing all 3 containers)")

    # -------------------------------------------------------------
    # 4. HOW TO RUN ON ANY COMPUTER (OR DOCKER DESKTOP)
    # -------------------------------------------------------------
    p = doc.add_paragraph()
    r = p.add_run("4. How to Pull and Run on Any Computer / Docker Desktop")
    format_run(r, bold=True, size_pt=13, color=COLOR_TITLE)
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.space_after = Pt(2)

    p = doc.add_paragraph()
    r = p.add_run("Method A: Turnkey Execution with Docker Compose (Recommended)")
    format_run(r, bold=True, color=COLOR_HEADING)

    add_code_box(doc, """# 1. Pull project and run all 3 containers
git clone https://github.com/lorndavid/khmer-data-api.git
cd khmer-data-api
docker compose -f docker-compose.hub.yml up -d

# 2. Check running status
docker ps""")

    p = doc.add_paragraph()
    r = p.add_run("Method B: Manual Execution via Docker Network & CLI (Like Classmate Model):")
    format_run(r, bold=True, color=COLOR_HEADING)

    add_code_box(doc, """# 1. Pull all 3 images from Docker Hub
docker pull lorndavid/khmerapi-database:latest
docker pull lorndavid/khmerapi-backend:latest
docker pull lorndavid/khmerapi-frontend:latest

# 2. Create isolated Docker network
docker network create khmerapi-net

# 3. Start Database Container
docker run -d \\
  --name khmerapi-database \\
  --network khmerapi-net \\
  -e POSTGRES_USER=postgres \\
  -e POSTGRES_PASSWORD=postgrespassword \\
  -e POSTGRES_DB=khmerapi \\
  -p 5432:5432 \\
  lorndavid/khmerapi-database:latest

# 4. Start Backend API Container
docker run -d \\
  --name khmerapi-backend \\
  --network khmerapi-net \\
  -p 4000:4000 \\
  -e DATABASE_URL=postgresql://postgres:postgrespassword@khmerapi-database:5432/khmerapi?schema=public \\
  lorndavid/khmerapi-backend:latest

# 5. Start Frontend Container
docker run -d \\
  --name khmerapi-frontend \\
  --network khmerapi-net \\
  -p 80:80 \\
  lorndavid/khmerapi-frontend:latest""")

    add_screenshot_placeholder(doc, "Screenshot 6: docker ps Output Showing All 3 Containers Running")

    # -------------------------------------------------------------
    # 5. TESTING & VERIFICATION
    # -------------------------------------------------------------
    p = doc.add_paragraph()
    r = p.add_run("5. Testing & Verification")
    format_run(r, bold=True, size_pt=13, color=COLOR_TITLE)
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.space_after = Pt(2)

    p = doc.add_paragraph()
    r = p.add_run("• Frontend Web UI: ")
    format_run(r, bold=True)
    add_hyperlink(p, "http://localhost", "http://localhost")
    r = p.add_run("\n• REST API All Provinces: ")
    format_run(r, bold=True)
    add_hyperlink(p, "http://localhost/v1/provinces", "http://localhost/v1/provinces")
    r = p.add_run("\n• Backend Health Check: ")
    format_run(r, bold=True)
    add_hyperlink(p, "http://localhost:4000/health", "http://localhost:4000/health")
    r = p.add_run("\n• Live Cloud Domain: ")
    format_run(r, bold=True)
    add_hyperlink(p, "https://khmerapi.lorndavid.online", "https://khmerapi.lorndavid.online")

    add_screenshot_placeholder(doc, "Screenshot 7: Frontend Website Interface running on http://localhost")
    add_screenshot_placeholder(doc, "Screenshot 8: REST API JSON Response for /v1/provinces")

    # -------------------------------------------------------------
    # THANK YOU
    # -------------------------------------------------------------
    p_ty = doc.add_paragraph()
    p_ty.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_ty.paragraph_format.space_before = Pt(24)
    p_ty.paragraph_format.space_after = Pt(8)
    r_ty = p_ty.add_run("THANK YOU")
    format_run(r_ty, font_name="Calibri", size_pt=24, bold=True, color=RGBColor(34, 139, 34))

    doc.save(output_path)
    print(f"Document successfully created at: {output_path}")

if __name__ == "__main__":
    out = r"d:\Developer Project\homework\Homework-Docker-3Containers-Complete.docx"
    create_model_docx(out)
