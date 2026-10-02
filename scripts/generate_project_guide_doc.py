import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
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

def create_guide_docx(output_path):
    doc = Document()

    for s in doc.sections:
        s.top_margin = Inches(0.8)
        s.bottom_margin = Inches(0.8)
        s.left_margin = Inches(0.8)
        s.right_margin = Inches(0.8)

    COLOR_TITLE = RGBColor(15, 52, 96)       # Deep Navy
    COLOR_HEADING = RGBColor(22, 121, 171)   # Teal Blue
    COLOR_TEXT = RGBColor(30, 41, 59)        # Slate Dark
    COLOR_BG = "F8FAFC"
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

    # Title
    p_main = doc.add_paragraph()
    p_main.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_m = p_main.add_run("KhmerAPI — Project Overview & Windows Docker Guide\n")
    format_run(r_m, bold=True, size_pt=18, color=COLOR_TITLE)
    r_sub = p_main.add_run("Complete Platform Features & Step-by-Step Installation for Windows")
    format_run(r_sub, bold=True, size_pt=11, color=COLOR_HEADING)

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

    # -------------------------------------------------------------
    # PART 1: WHAT THE WEBSITE DOES
    # -------------------------------------------------------------
    p = doc.add_paragraph()
    r = p.add_run("Part 1: What is KhmerAPI & What Does It Do?")
    format_run(r, bold=True, size_pt=13, color=COLOR_TITLE)
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.space_after = Pt(2)

    p = doc.add_paragraph()
    r = p.add_run("KhmerAPI is an open-source, full-stack Cambodian Geographic, Demographic, and Administrative Data Platform. It provides developers, businesses, and government researchers with clean, standardized, and high-performance REST APIs for Cambodia's complete administrative hierarchy and demographic data.")
    format_run(r)

    features = [
        ("1. Complete 4-Level Administrative Hierarchy:",
         "Covers all 25 Provinces, 210 Districts (Khan/Krong/Srok), 1,661 Communes (Sangkat/Khum), and 14,528 Villages (Phum) in both Khmer script and Latin English script with official NIS administrative codes."),
        ("2. Demographic & Population Insights (2013-2023):",
         "Historical population counts, annual growth trends, male/female ratios, and urban versus rural demographic splits across provinces."),
        ("3. Interactive API Explorer & Live Testing:",
         "Users can test endpoints directly in their web browser with real-time parameter filtering, pagination, search, and live response latency metrics."),
        ("4. GIS Spatial Boundaries (GeoJSON):",
         "High-precision polygon boundary coordinates for all 25 provinces ready for interactive mapping in Leaflet, Mapbox, or Google Maps."),
        ("5. Multi-Language Developer Documentation:",
         "Instant code snippets ready to copy for JavaScript/Node.js, Python, PHP, and cURL."),
        ("6. Bilingual Support:",
         "Full toggle between English and Khmer (ភាសាខ្មែរ) language interfaces.")
    ]

    for title, desc in features:
        p_f = doc.add_paragraph()
        p_f.paragraph_format.left_indent = Inches(0.2)
        p_f.paragraph_format.space_after = Pt(2)
        r1 = p_f.add_run(f"• {title} ")
        format_run(r1, bold=True, color=COLOR_HEADING)
        r2 = p_f.add_run(desc)
        format_run(r2)

    # -------------------------------------------------------------
    # PART 2: 3-TIER ARCHITECTURE
    # -------------------------------------------------------------
    p = doc.add_paragraph()
    r = p.add_run("Part 2: System Architecture (3 Clean Docker Containers)")
    format_run(r, bold=True, size_pt=13, color=COLOR_TITLE)
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.space_after = Pt(2)

    p = doc.add_paragraph()
    r = p.add_run("The application consists of 3 distinct, decoupled containers published on Docker Hub:")
    format_run(r)

    arch_items = [
        ("1. Database Container (khmerapi-database):",
         "PostgreSQL 16 Alpine database with health check and persistent data volume. Image: lorndavid/khmerapi-database:latest (Port 5432)."),
        ("2. Backend REST API Container (khmerapi-backend):",
         "Node.js Express application using Prisma ORM. On startup, it automatically synchronizes the database schema and populates all Cambodian geography records. Image: lorndavid/khmerapi-backend:latest (Port 4000)."),
        ("3. Frontend Container (khmerapi-frontend):",
         "Vue 3 single-page web app bundled with an internal Nginx web server. Nginx serves the UI and automatically reverse-proxies API calls from /v1/ to the backend container. Image: lorndavid/khmerapi-frontend:latest (Port 80).")
    ]
    for title, desc in arch_items:
        p_a = doc.add_paragraph()
        p_a.paragraph_format.left_indent = Inches(0.2)
        p_a.paragraph_format.space_after = Pt(2)
        r1 = p_a.add_run(f"• {title} ")
        format_run(r1, bold=True)
        r2 = p_a.add_run(desc)
        format_run(r2)

    # -------------------------------------------------------------
    # PART 3: STEP-BY-STEP WINDOWS DOCKER DESKTOP SETUP
    # -------------------------------------------------------------
    p = doc.add_paragraph()
    r = p.add_run("Part 3: Step-by-Step Installation on Windows (Docker Desktop)")
    format_run(r, bold=True, size_pt=13, color=COLOR_TITLE)
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.space_after = Pt(2)

    p = doc.add_paragraph()
    r = p.add_run("You do not need to install Node.js, Python, or Git. You only need Docker Desktop!")
    format_run(r, italic=True)

    # Step 1
    p = doc.add_paragraph()
    r = p.add_run("Step 1: Install Docker Desktop on Windows")
    format_run(r, bold=True, size_pt=11.5, color=COLOR_HEADING)
    p.paragraph_format.space_before = Pt(4)
    p.paragraph_format.space_after = Pt(1)

    steps_win = [
        "1. Check Virtualization: Open Task Manager (Ctrl+Shift+Esc) -> Performance -> CPU -> Verify Virtualization is Enabled.",
        "2. Download: Visit https://www.docker.com/products/docker-desktop and download Docker Desktop for Windows.",
        "3. Install: Run the installer. Ensure 'Use WSL 2 instead of Hyper-V' is checked.",
        "4. Reboot: Wait for installation to complete, then click 'Close and restart' your PC.",
        "5. Launch: Open Docker Desktop from Start menu, accept the terms, and wait for the status to show green (Engine running)."
    ]
    for s in steps_win:
        p_s = doc.add_paragraph()
        p_s.paragraph_format.left_indent = Inches(0.2)
        p_s.paragraph_format.space_after = Pt(1)
        r = p_s.add_run(s)
        format_run(r)

    # Step 2
    p = doc.add_paragraph()
    r = p.add_run("Step 2: Get the Project (Using Git Clone / Pull - Fastest)")
    format_run(r, bold=True, size_pt=11.5, color=COLOR_HEADING)
    p.paragraph_format.space_before = Pt(6)
    p.paragraph_format.space_after = Pt(1)

    p = doc.add_paragraph()
    r = p.add_run("Open PowerShell or Command Prompt on your computer and run:")
    format_run(r)

    add_code_box(doc, """# 1. Clone the project from GitHub
git clone https://github.com/lorndavid/khmer-data-api.git
cd khmer-data-api

# (If you already downloaded it previously, just pull the latest version):
git pull

# 2. Run all 3 containers with a single command:
docker compose -f docker-compose.hub.yml up -d""")

    p = doc.add_paragraph()
    r = p.add_run("Alternative (Without Git): ")
    format_run(r, bold=True)
    r2 = p.add_run("If you don't have Git installed, you can simply save this single ")
    format_run(r2)
    r3 = p.add_run("docker-compose.yml")
    format_run(r3, bold=True)
    r4 = p.add_run(" file and run `docker compose up -d`:")
    format_run(r4)

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

    # Step 3
    p = doc.add_paragraph()
    r = p.add_run("Step 3: Run the Application (1 Command)")
    format_run(r, bold=True, size_pt=11.5, color=COLOR_HEADING)
    p.paragraph_format.space_before = Pt(6)
    p.paragraph_format.space_after = Pt(1)

    p = doc.add_paragraph()
    r = p.add_run("Open PowerShell or Command Prompt in your folder and run:")
    format_run(r)

    add_code_box(doc, """# Start all 3 containers in background
docker compose up -d

# Output will show:
# ✔ Container khmerapi-database  Healthy
# ✔ Container khmerapi-backend   Started
# ✔ Container khmerapi-frontend  Started""")

    # Step 4
    p = doc.add_paragraph()
    r = p.add_run("Step 4: Open and Test in Web Browser")
    format_run(r, bold=True, size_pt=11.5, color=COLOR_HEADING)
    p.paragraph_format.space_before = Pt(6)
    p.paragraph_format.space_after = Pt(1)

    p = doc.add_paragraph()
    r = p.add_run("Once started, open your web browser (Chrome, Edge, Brave) and test:")
    format_run(r)

    urls = [
        ("Website UI & Explorer: ", "http://localhost", "Interactive interface and documentation"),
        ("REST API Provinces: ", "http://localhost/v1/provinces", "List of 25 Cambodian provinces"),
        ("REST API Villages: ", "http://localhost/v1/villages?limit=10", "Paginated village records"),
        ("System Health Check: ", "http://localhost:4000/health", "Backend health status JSON")
    ]
    for label, link, desc in urls:
        p_u = doc.add_paragraph()
        p_u.paragraph_format.left_indent = Inches(0.2)
        p_u.paragraph_format.space_after = Pt(1)
        r = p_u.add_run(f"• {label}")
        format_run(r, bold=True)
        add_hyperlink(p_u, link, link)
        r2 = p_u.add_run(f" — {desc}")
        format_run(r2)

    # Step 5
    p = doc.add_paragraph()
    r = p.add_run("Step 5: How to Stop or Restart")
    format_run(r, bold=True, size_pt=11.5, color=COLOR_HEADING)
    p.paragraph_format.space_before = Pt(6)
    p.paragraph_format.space_after = Pt(1)

    add_code_box(doc, """# Stop the containers
docker compose down

# Start containers again anytime
docker compose up -d""")

    # -------------------------------------------------------------
    # LIVE PRODUCTION URLS
    # -------------------------------------------------------------
    p = doc.add_paragraph()
    r = p.add_run("Live Cloud Production Deployment:")
    format_run(r, bold=True, size_pt=12, color=COLOR_TITLE)
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.space_after = Pt(1)

    p_c = doc.add_paragraph()
    p_c.paragraph_format.left_indent = Inches(0.2)
    r = p_c.add_run("• Live Web Platform: ")
    format_run(r, bold=True)
    add_hyperlink(p_c, "https://khmerapi.lorndavid.online", "https://khmerapi.lorndavid.online")
    r = p_c.add_run("\n• Live API Base URL: ")
    format_run(r, bold=True)
    add_hyperlink(p_c, "https://khmerapi.lorndavid.online/v1/provinces", "https://khmerapi.lorndavid.online/v1/provinces")
    r = p_c.add_run("\n• Docker Hub Images: ")
    format_run(r, bold=True)
    add_hyperlink(p_c, "https://hub.docker.com/u/lorndavid", "https://hub.docker.com/u/lorndavid")

    try:
        doc.save(output_path)
        print(f"Guide successfully generated at: {output_path}")
    except PermissionError:
        alt_path = output_path.replace(".docx", "-V2.docx")
        doc.save(alt_path)
        print(f"File was open in Word. Saved to alternative path: {alt_path}")

if __name__ == "__main__":
    out = r"d:\Developer Project\homework\Project-Overview-and-Windows-Docker-Guide.docx"
    create_guide_docx(out)
