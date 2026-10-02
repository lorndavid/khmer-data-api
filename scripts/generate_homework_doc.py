import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import qn, nsdecls

def create_homework_docx(output_path):
    doc = Document()

    # Page Margins: 0.8 inches
    for section in doc.sections:
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(0.8)
        section.right_margin = Inches(0.8)

    # Palette
    COLOR_PRIMARY = RGBColor(15, 52, 96)     # Deep Navy
    COLOR_SECONDARY = RGBColor(22, 121, 171) # Teal / Blue
    COLOR_TEXT = RGBColor(40, 40, 40)        # Dark Charcoal
    COLOR_CODE_BG = "F3F4F6"                 # Light Gray Hex
    COLOR_BOX_BG = "F8FAFC"                  # Very light slate

    # Helper: Set font
    def format_run(run, font_name="Calibri", size_pt=11, bold=False, italic=False, color=COLOR_TEXT):
        run.font.name = font_name
        run.font.size = Pt(size_pt)
        run.bold = bold
        run.italic = italic
        run.font.color.rgb = color

    # Helper: Code block box
    def add_code_block(doc, code_text):
        tbl = doc.add_table(rows=1, cols=1)
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        cell = tbl.cell(0, 0)
        cell.width = Inches(6.8)
        
        # Background color
        shading = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{COLOR_CODE_BG}"/>')
        cell._tc.get_or_add_tcPr().append(shading)
        
        # Border: thin left border or subtle border
        borders = parse_xml(f'''
            <w:tcBorders {nsdecls("w")}>
                <w:top w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/>
                <w:left w:val="single" w:sz="18" w:space="0" w:color="1679AB"/>
                <w:bottom w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/>
                <w:right w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/>
            </w:tcBorders>
        ''')
        cell._tc.get_or_add_tcPr().append(borders)
        
        p = cell.paragraphs[0]
        p.paragraph_format.space_before = Pt(4)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.left_indent = Inches(0.1)
        run = p.add_run(code_text)
        format_run(run, font_name="Consolas", size_pt=9.5, color=RGBColor(30, 41, 59))
        doc.add_paragraph().paragraph_format.space_after = Pt(4)

    # 1. TOP HEADER BOX (Matching Home Work-install-docker.pdf)
    header_table = doc.add_table(rows=1, cols=2)
    header_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell_info = header_table.cell(0, 0)
    cell_title = header_table.cell(0, 1)
    
    cell_info.width = Inches(3.2)
    cell_title.width = Inches(3.6)

    # Border around info box
    info_borders = parse_xml(f'''
        <w:tcBorders {nsdecls("w")}>
            <w:top w:val="single" w:sz="8" w:space="0" w:color="64748B"/>
            <w:left w:val="single" w:sz="8" w:space="0" w:color="64748B"/>
            <w:bottom w:val="single" w:sz="8" w:space="0" w:color="64748B"/>
            <w:right w:val="single" w:sz="8" w:space="0" w:color="64748B"/>
        </w:tcBorders>
    ''')
    cell_info._tc.get_or_add_tcPr().append(info_borders)
    info_shading = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{COLOR_BOX_BG}"/>')
    cell_info._tc.get_or_add_tcPr().append(info_shading)

    p_info = cell_info.paragraphs[0]
    p_info.paragraph_format.space_before = Pt(6)
    p_info.paragraph_format.space_after = Pt(2)
    r = p_info.add_run("Name: ")
    format_run(r, bold=True, size_pt=10.5)
    r2 = p_info.add_run("Lorn David\n")
    format_run(r2, bold=False, size_pt=10.5)

    r3 = p_info.add_run("ID: ")
    format_run(r3, bold=True, size_pt=10.5)
    r4 = p_info.add_run("DIT2024139\n")
    format_run(r4, bold=False, size_pt=10.5)

    r5 = p_info.add_run("Class: ")
    format_run(r5, bold=True, size_pt=10.5)
    r6 = p_info.add_run("PG-A\n")
    format_run(r6, bold=False, size_pt=10.5)

    r7 = p_info.add_run("Subject: ")
    format_run(r7, bold=True, size_pt=10.5)
    r8 = p_info.add_run("Docker Three Containers & Cloud")
    format_run(r8, bold=False, size_pt=10.5)

    # Title in right cell or center
    p_title = cell_title.paragraphs[0]
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_before = Pt(18)
    r_t1 = p_title.add_run("HOMEWORK REPORT\n")
    format_run(r_t1, bold=True, size_pt=18, color=COLOR_PRIMARY)
    r_t2 = p_title.add_run("Docker 3-Tier Architecture & VPS Deployment")
    format_run(r_t2, bold=True, size_pt=11, color=COLOR_SECONDARY)

    doc.add_paragraph().paragraph_format.space_after = Pt(12)

    # -------------------------------------------------------------
    # SECTION 1
    # -------------------------------------------------------------
    p = doc.add_paragraph()
    r = p.add_run("1. How to Download and Install Docker")
    format_run(r, bold=True, size_pt=14, color=COLOR_PRIMARY)
    p.paragraph_format.space_before = Pt(12)
    p.paragraph_format.space_after = Pt(4)

    # 1.1 Windows
    p = doc.add_paragraph()
    r = p.add_run("1.1 On Windows")
    format_run(r, bold=True, size_pt=12, color=COLOR_SECONDARY)
    p.paragraph_format.space_before = Pt(6)
    p.paragraph_format.space_after = Pt(2)

    p = doc.add_paragraph()
    r = p.add_run("• System Prerequisites: ")
    format_run(r, bold=True)
    r2 = p.add_run("Enable WSL 2 (Windows Subsystem for Linux) and Hardware Virtualization in BIOS / Windows Features.")
    format_run(r2)

    p = doc.add_paragraph()
    r = p.add_run("• Step-by-Step Installation:")
    format_run(r, bold=True)
    p.paragraph_format.space_after = Pt(2)

    steps_win = [
        "Visit the official Docker website: https://www.docker.com/products/docker-desktop",
        "Click the button 'Download for Windows' to download Docker Desktop Installer.exe.",
        "Run the installer and make sure to select 'Use WSL 2 instead of Hyper-V (recommended)'.",
        "Wait for the installation process to complete, then click 'Close and restart' your computer.",
        "After the computer boots up, launch Docker Desktop and accept the service agreement.",
        "Open PowerShell or Command Prompt (cmd) and run the verification command:"
    ]
    for idx, s in enumerate(steps_win, start=1):
        p_step = doc.add_paragraph()
        p_step.paragraph_format.left_indent = Inches(0.25)
        p_step.paragraph_format.space_after = Pt(2)
        r_num = p_step.add_run(f"{idx}. ")
        format_run(r_num, bold=True)
        r_txt = p_step.add_run(s)
        format_run(r_txt)

    add_code_block(doc, "> docker --version\nDocker version 29.7.2, build a7dcaa6\n\n> docker compose version\nDocker Compose version v2.32.4")

    # 1.2 Linux
    p = doc.add_paragraph()
    r = p.add_run("1.2 On Linux (Ubuntu / Debian VPS)")
    format_run(r, bold=True, size_pt=12, color=COLOR_SECONDARY)
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.space_after = Pt(2)

    p = doc.add_paragraph()
    r = p.add_run("On Linux, Docker Engine is installed via Command Line (Terminal) using the official APT repository:")
    format_run(r)

    steps_linux = [
        ("1. Remove old or conflicting packages (if any):",
         "sudo apt remove docker docker-engine docker.io containerd runc"),
        ("2. Update package lists and install prerequisite utilities:",
         "sudo apt update\nsudo apt install -y ca-certificates curl gnupg lsb-release"),
        ("3. Add Docker's official GPG key:",
         "sudo install -m 0755 -d /etc/apt/keyrings\ncurl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg\nsudo chmod a+r /etc/apt/keyrings/docker.gpg"),
        ("4. Set up the official stable repository:",
         'echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null'),
        ("5. Install Docker Engine, CLI, and Docker Compose plugin:",
         "sudo apt update\nsudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin"),
        ("6. Allow regular non-root user to run Docker commands:",
         "sudo usermod -aG docker $USER\nnewgrp docker"),
        ("7. Verify Docker installation:",
         "docker --version\n# Output: Docker version 27.5.1, build 9f9e405")
    ]

    for title, cmd in steps_linux:
        p_l = doc.add_paragraph()
        p_l.paragraph_format.left_indent = Inches(0.2)
        p_l.paragraph_format.space_after = Pt(2)
        r = p_l.add_run(title)
        format_run(r, bold=True)
        add_code_block(doc, cmd)

    # -------------------------------------------------------------
    # SECTION 2
    # -------------------------------------------------------------
    p = doc.add_paragraph()
    r = p.add_run("2. Create Docker Account, Pull, Tag, and Push Images (All 3 Containers)")
    format_run(r, bold=True, size_pt=14, color=COLOR_PRIMARY)
    p.paragraph_format.space_before = Pt(14)
    p.paragraph_format.space_after = Pt(4)

    p = doc.add_paragraph()
    r = p.add_run("This workflow is executed identically across Windows (PowerShell) and Linux (Terminal) to deliver all 3 project containers directly to Docker Hub.")
    format_run(r)

    # 2.1 Create Account
    p = doc.add_paragraph()
    r = p.add_run("2.1 Create Docker Hub Account")
    format_run(r, bold=True, size_pt=12, color=COLOR_SECONDARY)
    p.paragraph_format.space_before = Pt(6)

    d_steps = [
        "Visit https://hub.docker.com and click 'Sign Up'.",
        "Fill in account credentials: Username (lorndavid), Email address, and secure Password.",
        "Check your email inbox and click the verification link to confirm and activate your Docker Hub account."
    ]
    for idx, s in enumerate(d_steps, start=1):
        p_step = doc.add_paragraph()
        p_step.paragraph_format.left_indent = Inches(0.25)
        p_step.paragraph_format.space_after = Pt(2)
        r_num = p_step.add_run(f"{idx}. ")
        format_run(r_num, bold=True)
        r_txt = p_step.add_run(s)
        format_run(r_txt)

    # 2.2 CLI Login
    p = doc.add_paragraph()
    r = p.add_run("2.2 Login to Docker Hub via Terminal")
    format_run(r, bold=True, size_pt=12, color=COLOR_SECONDARY)
    p.paragraph_format.space_before = Pt(6)

    p = doc.add_paragraph()
    r = p.add_run("Execute the login command and enter your Docker Hub username and password/access token:")
    format_run(r)

    add_code_block(doc, "> docker login\nUsername: lorndavid\nPassword: ********\nLogin Succeeded")

    # 2.3 Tag & Push All 3 Containers
    p = doc.add_paragraph()
    r = p.add_run("2.3 Build, Tag, and Push All 3 Containers to Docker Hub")
    format_run(r, bold=True, size_pt=12, color=COLOR_SECONDARY)
    p.paragraph_format.space_before = Pt(6)

    p = doc.add_paragraph()
    r = p.add_run("To satisfy the homework requirement of 3 distinct containers, all 3 images were tagged and published under the personal account ")
    format_run(r)
    r2 = p.add_run("lorndavid")
    format_run(r2, bold=True, color=COLOR_PRIMARY)
    r3 = p.add_run(":")
    format_run(r3)

    add_code_block(doc, """# --- 1. Database Image (PostgreSQL 16) ---
docker pull postgres:16-alpine
docker tag postgres:16-alpine lorndavid/khmerapi-database:latest
docker tag postgres:16-alpine lorndavid/khmerapi-database:1.0.0
docker push lorndavid/khmerapi-database:latest
docker push lorndavid/khmerapi-database:1.0.0

# --- 2. Backend REST API Image (Node.js Express) ---
docker build -t lorndavid/khmerapi-backend:latest -t lorndavid/khmerapi-backend:1.0.0 -f Dockerfile.backend .
docker push lorndavid/khmerapi-backend:latest
docker push lorndavid/khmerapi-backend:1.0.0

# --- 3. Frontend Web Application Image (Vue 3 + Nginx) ---
docker build -t lorndavid/khmerapi-frontend:latest -t lorndavid/khmerapi-frontend:1.0.0 -f frontend/Dockerfile frontend
docker push lorndavid/khmerapi-frontend:latest
docker push lorndavid/khmerapi-frontend:1.0.0""")

    # Verification on Docker Hub
    p = doc.add_paragraph()
    r = p.add_run("• Verification on Docker Hub:")
    format_run(r, bold=True)
    p.paragraph_format.space_after = Pt(2)
    p2 = doc.add_paragraph()
    p2.paragraph_format.left_indent = Inches(0.2)
    r = p2.add_run("Navigating to https://hub.docker.com/u/lorndavid confirms all 3 active public repositories:")
    format_run(r)

    # Table of 3 images
    img_table = doc.add_table(rows=4, cols=4)
    img_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    headers = ["Container", "Repository / Image Name", "Tags Available", "Status"]
    row_hdr = img_table.rows[0]
    for i, h in enumerate(headers):
        cell = row_hdr.cells[i]
        shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="1E293B"/>')
        cell._tc.get_or_add_tcPr().append(shd)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        run = p.add_run(h)
        format_run(run, bold=True, size_pt=9.5, color=RGBColor(255, 255, 255))

    data_rows = [
        ("1. Database", "lorndavid/khmerapi-database", "latest, 1.0.0", "Active on Docker Hub"),
        ("2. Backend API", "lorndavid/khmerapi-backend", "latest, 1.0.0", "Active on Docker Hub"),
        ("3. Frontend Web", "lorndavid/khmerapi-frontend", "latest, 1.0.0", "Active on Docker Hub")
    ]
    for row_idx, data in enumerate(data_rows, start=1):
        r_obj = img_table.rows[row_idx]
        bg_color = "F8FAFC" if row_idx % 2 == 1 else "FFFFFF"
        for col_idx, text in enumerate(data):
            c = r_obj.cells[col_idx]
            shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{bg_color}"/>')
            c._tc.get_or_add_tcPr().append(shd)
            p = c.paragraphs[0]
            run = p.add_run(text)
            format_run(run, size_pt=9.5, bold=(col_idx==0 or col_idx==1))

    # Add Docker Hub Screenshot
    screenshot_src = r"C:\Users\Digital Team\.gemini\antigravity-ide\brain\81677959-0367-4e4d-8f15-ebaf60221953\.user_uploaded\media_1790971056528.png"
    if os.path.exists(screenshot_src):
        import shutil
        hw_img = os.path.join(os.path.dirname(output_path), "dockerhub-screenshot.png")
        shutil.copyfile(screenshot_src, hw_img)
        p_img = doc.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img.paragraph_format.space_before = Pt(8)
        p_img.paragraph_format.space_after = Pt(2)
        doc.add_picture(hw_img, width=Inches(6.5))
        p_cap = doc.add_paragraph()
        p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r_cap = p_cap.add_run("Figure 2.1: Published Container Repositories on Docker Hub (account: lorndavid)")
        format_run(r_cap, size_pt=9, italic=True, color=RGBColor(100, 116, 139))

    doc.add_paragraph().paragraph_format.space_after = Pt(8)

    # -------------------------------------------------------------
    # SECTION 3
    # -------------------------------------------------------------
    p = doc.add_paragraph()
    r = p.add_run("3. The 3 Docker Containers Architecture & Docker Desktop Setup")
    format_run(r, bold=True, size_pt=14, color=COLOR_PRIMARY)
    p.paragraph_format.space_before = Pt(14)
    p.paragraph_format.space_after = Pt(4)

    p = doc.add_paragraph()
    r = p.add_run("The complete system is orchestrated using Docker Compose. The teacher can evaluate and run all 3 containers on Docker Desktop with zero local code compilation or dependencies.")
    format_run(r)

    # Architecture Breakdown
    arch_points = [
        ("1.1 Database Container (khmerapi-database):",
         "Runs PostgreSQL 16 on Alpine Linux. Listens on internal port 5432. Automatically maps persistent storage volume 'khmerapi_db_data' and includes pg_isready health checks."),
        ("1.2 Backend Container (khmerapi-backend):",
         "Node.js Express REST API server built with Prisma ORM. On startup, it synchronizes database schemas and imports complete Cambodian geographic data (25 provinces, 210 districts, 1,661 communes, 14,528 villages) automatically."),
        ("1.3 Frontend Container (khmerapi-frontend):",
         "Vue 3 single-page application served via an internal Nginx web server on port 80. Nginx proxies all '/v1/' requests directly to the backend container, eliminating cross-origin (CORS) issues.")
    ]
    for title, desc in arch_points:
        p_a = doc.add_paragraph()
        p_a.paragraph_format.left_indent = Inches(0.2)
        p_a.paragraph_format.space_after = Pt(2)
        r1 = p_a.add_run(f"• {title} ")
        format_run(r1, bold=True, color=COLOR_SECONDARY)
        r2 = p_a.add_run(desc)
        format_run(r2)

    p = doc.add_paragraph()
    r = p.add_run("• Complete Turnkey docker-compose.yml Configuration:")
    format_run(r, bold=True)
    p.paragraph_format.space_before = Pt(6)
    p.paragraph_format.space_after = Pt(2)

    add_code_block(doc, """name: khmerapi

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

  # 2. Backend REST API Container
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

  # 3. Frontend Web Application Container
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
    r = p.add_run("• How to Run and Test on Docker Desktop:")
    format_run(r, bold=True)
    p.paragraph_format.space_after = Pt(2)

    add_code_block(doc, """# 1. Start all 3 containers with a single command
docker compose up -d

# 2. Verify all 3 containers are healthy and running
docker ps

# 3. Test in Browser:
# Frontend Web App:  http://localhost
# REST API Endpoint: http://localhost/v1/provinces
# Health Status:     http://localhost:4000/health

# 4. Stop containers when finished:
docker compose down""")

    # -------------------------------------------------------------
    # SECTION 4
    # -------------------------------------------------------------
    p = doc.add_paragraph()
    r = p.add_run("4. Production Deployment on Free VPS & Free Domain with Nginx Proxy Manager")
    format_run(r, bold=True, size_pt=14, color=COLOR_PRIMARY)
    p.paragraph_format.space_before = Pt(14)
    p.paragraph_format.space_after = Pt(4)

    p = doc.add_paragraph()
    r = p.add_run("In addition to local Docker Desktop execution, the project is deployed to a live Cloud VPS environment with automated HTTPS SSL and reverse proxy management.")
    format_run(r)

    vps_points = [
        ("Cloud VPS Server:", "Ubuntu 24.04 LTS (Hostinger Cloud VPS), Public IPv4: 147.93.111.196."),
        ("Custom Domain:", "Configured DNS A-Record for khmerapi.lorndavid.online pointing to the VPS IP."),
        ("Nginx Proxy Manager Container:", "Deployed official 'jc21/nginx-proxy-manager:latest' on ports 80, 81 (Admin Web UI), and 443 (HTTPS)."),
        ("SSL & Security:", "Automated Let's Encrypt SSL certificate with HTTP-to-HTTPS forced redirection, HSTS, and HTTP/2 support."),
        ("Proxy Routing:", "Forwarding https://khmerapi.lorndavid.online directly to container 'khmerapi-frontend:80'.")
    ]
    for label, val in vps_points:
        p_v = doc.add_paragraph()
        p_v.paragraph_format.left_indent = Inches(0.2)
        p_v.paragraph_format.space_after = Pt(2)
        r1 = p_v.add_run(f"• {label} ")
        format_run(r1, bold=True)
        r2 = p_v.add_run(val)
        format_run(r2)

    p = doc.add_paragraph()
    r = p.add_run("• Live Cloud Production URLs:")
    format_run(r, bold=True)
    p.paragraph_format.space_before = Pt(6)

    add_code_block(doc, """🌐 Live Web Application:  https://khmerapi.lorndavid.online
📡 Live API Base URL:     https://khmerapi.lorndavid.online/v1/provinces
🩺 Live API Health:       https://khmerapi.lorndavid.online/health
🔐 Nginx Proxy Manager:   http://147.93.111.196:81""")

    # -------------------------------------------------------------
    # SECTION 5: CONCLUSION & THANK YOU
    # -------------------------------------------------------------
    p = doc.add_paragraph()
    r = p.add_run("5. Summary of Completed Objectives")
    format_run(r, bold=True, size_pt=14, color=COLOR_PRIMARY)
    p.paragraph_format.space_before = Pt(14)
    p.paragraph_format.space_after = Pt(4)

    checklist = [
        "✅ 1.1 Database Container created, configured, and published to Docker Hub.",
        "✅ 1.2 Backend REST API Container created, configured, and published to Docker Hub.",
        "✅ 1.3 Frontend Web Application Container created, configured, and published to Docker Hub.",
        "✅ 2.1 Free Domain & Cloud VPS configured with DNS A-Records.",
        "✅ 2.2 Live Web Application hosted with Docker and Nginx Proxy Manager with Let's Encrypt SSL.",
        "✅ Turnkey evaluation supported for teacher on Docker Desktop via 'docker compose up -d'."
    ]
    for item in checklist:
        p_c = doc.add_paragraph()
        p_c.paragraph_format.left_indent = Inches(0.2)
        p_c.paragraph_format.space_after = Pt(2)
        r = p_c.add_run(item)
        format_run(r, bold=True, color=COLOR_PRIMARY)

    # Thank you footer (Matching Page 5 of sample PDF)
    p_ty = doc.add_paragraph()
    p_ty.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_ty.paragraph_format.space_before = Pt(36)
    p_ty.paragraph_format.space_after = Pt(12)
    r_ty = p_ty.add_run("THANK YOU")
    format_run(r_ty, font_name="Calibri", size_pt=26, bold=True, color=RGBColor(34, 139, 34))

    doc.save(output_path)
    print(f"Document successfully created at: {output_path}")

if __name__ == "__main__":
    out_file = r"d:\Developer Project\homework\Home Work-Docker-Containers.docx"
    create_homework_docx(out_file)
