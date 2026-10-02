import os
import shutil
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

def add_hyperlink(paragraph, url, text, color="1679AB", underline=True):
    """Adds a clickable hyperlink into a python-docx paragraph."""
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

def create_simple_homework_doc(output_path):
    doc = Document()

    # Margins: 0.8 inches
    for section in doc.sections:
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(0.8)
        section.right_margin = Inches(0.8)

    COLOR_TITLE = RGBColor(15, 52, 96)       # Deep Navy
    COLOR_HEADING = RGBColor(22, 121, 171)   # Blue
    COLOR_TEXT = RGBColor(30, 41, 59)        # Slate Dark
    COLOR_CODE_BG = "F1F5F9"

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

    # -------------------------------------------------------------
    # 1. HEADER (Top Left Box + Centered Title)
    # -------------------------------------------------------------
    tbl_top = doc.add_table(rows=1, cols=2)
    tbl_top.alignment = WD_TABLE_ALIGNMENT.CENTER
    c_info, c_title = tbl_top.cell(0, 0), tbl_top.cell(0, 1)
    c_info.width = Inches(3.2)
    c_title.width = Inches(3.6)

    # Border for info cell
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
    r_t1 = p_title.add_run("Home Work\n")
    format_run(r_t1, bold=True, size_pt=20, color=COLOR_TITLE)
    r_t2 = p_title.add_run("Docker Three Containers & Cloud Deployment")
    format_run(r_t2, bold=True, size_pt=10.5, color=COLOR_HEADING)

    doc.add_paragraph().paragraph_format.space_after = Pt(8)

    # -------------------------------------------------------------
    # SECTION 1: DOWNLOAD & INSTALL DOCKER
    # -------------------------------------------------------------
    p = doc.add_paragraph()
    r = p.add_run("1. How to Download and Install Docker")
    format_run(r, bold=True, size_pt=13, color=COLOR_TITLE)
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.space_after = Pt(2)

    # 1.1 Windows
    p = doc.add_paragraph()
    r = p.add_run("1.1 On Windows")
    format_run(r, bold=True, size_pt=11.5, color=COLOR_HEADING)
    p.paragraph_format.space_before = Pt(4)
    p.paragraph_format.space_after = Pt(1)

    p = doc.add_paragraph()
    r = p.add_run("• Prerequisites: ")
    format_run(r, bold=True)
    r2 = p.add_run("Enable WSL 2 (Windows Subsystem for Linux) and Hardware Virtualization in BIOS / Task Manager.")
    format_run(r2)

    p = doc.add_paragraph()
    r = p.add_run("• Installation Steps:\n")
    format_run(r, bold=True)
    r = p.add_run("  1. Visit official website: ")
    format_run(r)
    add_hyperlink(p, "https://www.docker.com/products/docker-desktop", "docker.com/products/docker-desktop")
    r = p.add_run("\n  2. Click 'Download for Windows' (Docker Desktop Installer.exe).")
    format_run(r)
    r = p.add_run("\n  3. Run the installer and choose 'Use WSL 2 instead of Hyper-V (recommended)'.")
    format_run(r)
    r = p.add_run("\n  4. Wait for install to complete, then click 'Close and restart' your computer.")
    format_run(r)
    r = p.add_run("\n  5. Open Docker Desktop and verify in terminal:")
    format_run(r)

    add_code_box(doc, "> docker --version\nDocker version 29.7.2, build a7dcaa6\n\n> docker compose version\nDocker Compose version v2.32.4")

    # 1.2 Linux
    p = doc.add_paragraph()
    r = p.add_run("1.2 On Linux (Ubuntu / Debian VPS)")
    format_run(r, bold=True, size_pt=11.5, color=COLOR_HEADING)
    p.paragraph_format.space_before = Pt(6)
    p.paragraph_format.space_after = Pt(1)

    p = doc.add_paragraph()
    r = p.add_run("Install Docker Engine and Docker Compose via Terminal with APT repository:")
    format_run(r)

    add_code_box(doc, """# 1. Update and install required tools
sudo apt update && sudo apt install -y ca-certificates curl gnupg lsb-release

# 2. Add Docker Official GPG Key & Repository
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 3. Install Docker Engine and Compose Plugin
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 4. Enable non-root user and check version
sudo usermod -aG docker $USER && newgrp docker
docker --version""")

    # -------------------------------------------------------------
    # SECTION 2: DOCKER HUB & 3 CONTAINERS PUSH
    # -------------------------------------------------------------
    p = doc.add_paragraph()
    r = p.add_run("2. Create Docker Hub Account, Pull & Push Images (3 Containers)")
    format_run(r, bold=True, size_pt=13, color=COLOR_TITLE)
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.space_after = Pt(2)

    p = doc.add_paragraph()
    r = p.add_run("2.1 Create Docker Hub Account: ")
    format_run(r, bold=True, color=COLOR_HEADING)
    r2 = p.add_run("Sign up at ")
    format_run(r2)
    add_hyperlink(p, "https://hub.docker.com", "hub.docker.com")
    r3 = p.add_run(" (Username: ")
    format_run(r3)
    r4 = p.add_run("lorndavid")
    format_run(r4, bold=True)
    r5 = p.add_run(").")
    format_run(r5)

    p = doc.add_paragraph()
    r = p.add_run("2.2 Terminal Login: ")
    format_run(r, bold=True, color=COLOR_HEADING)
    r2 = p.add_run("Run `docker login` and enter credentials to authenticate.")
    format_run(r2)

    add_code_box(doc, "> docker login\nUsername: lorndavid\nPassword: ********\nLogin Succeeded")

    p = doc.add_paragraph()
    r = p.add_run("2.3 Tag and Push All 3 Containers to Docker Hub:")
    format_run(r, bold=True, color=COLOR_HEADING)

    add_code_box(doc, """# 1. Database Image (PostgreSQL 16)
docker pull postgres:16-alpine
docker tag postgres:16-alpine lorndavid/khmerapi-database:latest
docker push lorndavid/khmerapi-database:latest

# 2. Backend REST API Image (Node.js Express)
docker build -t lorndavid/khmerapi-backend:latest -f Dockerfile.backend .
docker push lorndavid/khmerapi-backend:latest

# 3. Frontend Web Image (Vue 3 + Nginx)
docker build -t lorndavid/khmerapi-frontend:latest -f frontend/Dockerfile frontend
docker push lorndavid/khmerapi-frontend:latest""")

    # Clickable link to Docker Hub
    p_link = doc.add_paragraph()
    r = p_link.add_run("• Verify on Docker Hub: ")
    format_run(r, bold=True)
    add_hyperlink(p_link, "https://hub.docker.com/u/lorndavid", "https://hub.docker.com/u/lorndavid")

    # Embed screenshot
    screenshot_src = r"C:\Users\Digital Team\.gemini\antigravity-ide\brain\81677959-0367-4e4d-8f15-ebaf60221953\.user_uploaded\media_1790971056528.png"
    if os.path.exists(screenshot_src):
        hw_img = os.path.join(os.path.dirname(output_path), "dockerhub-screenshot.png")
        shutil.copyfile(screenshot_src, hw_img)
        p_img = doc.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img.paragraph_format.space_before = Pt(4)
        p_img.paragraph_format.space_after = Pt(2)
        doc.add_picture(hw_img, width=Inches(6.2))
        p_cap = doc.add_paragraph()
        p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r_cap = p_cap.add_run("Verified Images on Docker Hub: lorndavid/khmerapi-database, khmerapi-backend, khmerapi-frontend")
        format_run(r_cap, size_pt=9, italic=True, color=RGBColor(100, 116, 139))

    # -------------------------------------------------------------
    # SECTION 3: 3 CONTAINERS ARCHITECTURE & DOCKER DESKTOP
    # -------------------------------------------------------------
    p = doc.add_paragraph()
    r = p.add_run("3. The 3 Containers Setup for Docker Desktop (Teacher Run)")
    format_run(r, bold=True, size_pt=13, color=COLOR_TITLE)
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.space_after = Pt(2)

    p = doc.add_paragraph()
    r = p.add_run("The teacher can run all 3 containers on Docker Desktop using this single ")
    format_run(r)
    r2 = p.add_run("docker-compose.yml")
    format_run(r2, bold=True)
    r3 = p.add_run(" file:")
    format_run(r3)

    add_code_box(doc, """name: khmerapi

services:
  # 1. Database Container (PostgreSQL 16)
  database:
    image: lorndavid/khmerapi-database:latest
    container_name: khmerapi-database
    restart: unless-stopped
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgrespassword
      POSTGRES_DB: khmerapi
    ports:
      - "5432:5432"
    volumes:
      - khmerapi_db_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d khmerapi"]
      interval: 5s
      timeout: 5s
      retries: 5

  # 2. Backend Container (Node.js Express API)
  backend:
    image: lorndavid/khmerapi-backend:latest
    container_name: khmerapi-backend
    restart: unless-stopped
    ports:
      - "4000:4000"
    environment:
      NODE_ENV: production
      PORT: 4000
      HOST: 0.0.0.0
      DATABASE_URL: postgresql://postgres:postgrespassword@database:5432/khmerapi?schema=public
      REDIS_ENABLED: "false"
      CORS_ORIGINS: "*"
    depends_on:
      database:
        condition: service_healthy

  # 3. Frontend Container (Vue 3 + Nginx Reverse Proxy)
  frontend:
    image: lorndavid/khmerapi-frontend:latest
    container_name: khmerapi-frontend
    restart: unless-stopped
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  khmerapi_db_data:""")

    p = doc.add_paragraph()
    r = p.add_run("• Step to run in terminal:")
    format_run(r, bold=True)

    add_code_box(doc, """> docker compose up -d
✔ Container khmerapi-database  Healthy
✔ Container khmerapi-backend   Started
✔ Container khmerapi-frontend  Started""")

    p = doc.add_paragraph()
    r = p.add_run("• Local Browser Testing: ")
    format_run(r, bold=True)
    add_hyperlink(p, "http://localhost", "http://localhost")
    r2 = p.add_run(" (Frontend) | ")
    format_run(r2)
    add_hyperlink(p, "http://localhost/v1/provinces", "http://localhost/v1/provinces")
    r3 = p.add_run(" (API)")
    format_run(r3)

    # -------------------------------------------------------------
    # SECTION 4: FREE DOMAIN & FREE VPS WITH NGINX PROXY MANAGER
    # -------------------------------------------------------------
    p = doc.add_paragraph()
    r = p.add_run("4. Cloud Hosting on Free VPS & Domain with Nginx Proxy Manager")
    format_run(r, bold=True, size_pt=13, color=COLOR_TITLE)
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.space_after = Pt(2)

    p = doc.add_paragraph()
    r = p.add_run("• Cloud VPS: ")
    format_run(r, bold=True)
    r = p.add_run("Ubuntu 24.04 LTS Server (IP: 147.93.111.196)\n")
    format_run(r)
    r = p.add_run("• Nginx Proxy Manager: ")
    format_run(r, bold=True)
    r = p.add_run("Deployed via Docker container (`jc21/nginx-proxy-manager`) on port 81 with automated Let's Encrypt SSL.\n")
    format_run(r)
    r = p.add_run("• Reverse Proxy Routing: ")
    format_run(r, bold=True)
    r = p.add_run("Forwards public HTTPS requests to the `khmerapi-frontend:80` container.")
    format_run(r)

    p_live = doc.add_paragraph()
    p_live.paragraph_format.space_before = Pt(4)
    r = p_live.add_run("• Clickable Live Domain Links:\n")
    format_run(r, bold=True)
    r = p_live.add_run("  🌐 Live Web Application: ")
    format_run(r)
    add_hyperlink(p_live, "https://khmerapi.lorndavid.online", "https://khmerapi.lorndavid.online")
    r = p_live.add_run("\n  📡 Live REST API Endpoint: ")
    format_run(r)
    add_hyperlink(p_live, "https://khmerapi.lorndavid.online/v1/provinces", "https://khmerapi.lorndavid.online/v1/provinces")
    r = p_live.add_run("\n  🩺 Live API Health Status: ")
    format_run(r)
    add_hyperlink(p_live, "https://khmerapi.lorndavid.online/health", "https://khmerapi.lorndavid.online/health")

    # -------------------------------------------------------------
    # SECTION 5: THANK YOU
    # -------------------------------------------------------------
    p_ty = doc.add_paragraph()
    p_ty.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_ty.paragraph_format.space_before = Pt(28)
    p_ty.paragraph_format.space_after = Pt(8)
    r_ty = p_ty.add_run("THANK YOU")
    format_run(r_ty, font_name="Calibri", size_pt=26, bold=True, color=RGBColor(34, 139, 34))

    try:
        doc.save(output_path)
        print(f"Simple Document successfully generated at: {output_path}")
    except PermissionError:
        alt_path = output_path.replace(".docx", "-Simple.docx")
        doc.save(alt_path)
        print(f"File was open in Word. Saved to alternative path: {alt_path}")

if __name__ == "__main__":
    out = r"d:\Developer Project\homework\Home Work-Docker-Containers.docx"
    create_simple_homework_doc(out)
