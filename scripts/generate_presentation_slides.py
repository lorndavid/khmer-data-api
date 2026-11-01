import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def create_slides(output_path):
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # White Background Palette
    BG_WHITE = RGBColor(255, 255, 255)       # Pure White
    CARD_BG = RGBColor(248, 250, 252)        # Slate 50 (Very light gray)
    CODE_BG = RGBColor(241, 245, 249)        # Slate 100 (Code block background)
    BORDER_LIGHT = RGBColor(203, 213, 225)   # Slate 300
    BORDER_DARK = RGBColor(148, 163, 184)    # Slate 400
    PRIMARY = RGBColor(14, 116, 144)         # Deep Cyan / Teal
    ACCENT_BLUE = RGBColor(2, 132, 199)      # Sky 600
    TEXT_BLACK = RGBColor(15, 23, 42)        # Slate 900 (Main text)
    TEXT_MUTED = RGBColor(100, 116, 139)     # Slate 500 (Subtext)
    ACCENT_GREEN = RGBColor(22, 101, 52)     # Forest Green

    def apply_bg(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = BG_WHITE
        bg.line.fill.background()
        return bg

    def add_header(slide, title_text, category_text="HOMEWORK REPORT"):
        txBox = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.7), Inches(0.4))
        tf = txBox.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = category_text.upper()
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = PRIMARY

        p2 = tf.add_paragraph()
        p2.text = title_text
        p2.font.size = Pt(22)
        p2.font.bold = True
        p2.font.color.rgb = TEXT_BLACK

    def add_code_box(slide, left, top, width, height, code_text):
        box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        box.fill.solid()
        box.fill.fore_color.rgb = CODE_BG
        box.line.color.rgb = BORDER_LIGHT
        box.line.width = Pt(1)

        tf = box.text_frame
        tf.word_wrap = True
        tf.vertical_anchor = MSO_ANCHOR.TOP
        p = tf.paragraphs[0]
        p.text = code_text
        p.font.name = "Consolas"
        p.font.size = Pt(10)
        p.font.color.rgb = TEXT_BLACK
        return box

    def add_screenshot_placeholder(slide, left, top, width, height, label="PASTE SCREENSHOT HERE"):
        box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        box.fill.solid()
        box.fill.fore_color.rgb = CARD_BG
        box.line.color.rgb = BORDER_DARK
        box.line.width = Pt(1.5)

        tf = box.text_frame
        tf.word_wrap = True
        tf.vertical_anchor = MSO_ANCHOR.MIDDLE
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        p.text = f"📷  [ {label} ]"
        p.font.bold = True
        p.font.size = Pt(13)
        p.font.color.rgb = PRIMARY

        p2 = tf.add_paragraph()
        p2.alignment = PP_ALIGN.CENTER
        p2.text = "Click box -> Press Ctrl+V to paste your image"
        p2.font.size = Pt(10)
        p2.font.color.rgb = TEXT_MUTED
        return box

    # ========================================================
    # SLIDE 1: TITLE SLIDE (WHITE BACKGROUND)
    # ========================================================
    slide1 = prs.slides.add_slide(blank_layout)
    apply_bg(slide1)

    card = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.5), Inches(1.2), Inches(10.333), Inches(5.1))
    card.fill.solid()
    card.fill.fore_color.rgb = CARD_BG
    card.line.color.rgb = BORDER_LIGHT
    card.line.width = Pt(1.5)

    tf = card.text_frame
    tf.word_wrap = True
    tf.vertical_anchor = MSO_ANCHOR.MIDDLE

    p = tf.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    p.text = "DOCKER HOMEWORK PRESENTATION"
    p.font.bold = True
    p.font.size = Pt(14)
    p.font.color.rgb = PRIMARY

    p2 = tf.add_paragraph()
    p2.alignment = PP_ALIGN.CENTER
    p2.text = "Three Containers & Cloud Hosting"
    p2.font.bold = True
    p2.font.size = Pt(32)
    p2.font.color.rgb = TEXT_BLACK

    p3 = tf.add_paragraph()
    p3.alignment = PP_ALIGN.CENTER
    p3.text = "PostgreSQL DB • Node.js Backend • Vue 3 Frontend • Free VPS & Nginx Proxy Manager"
    p3.font.size = Pt(14)
    p3.font.color.rgb = ACCENT_BLUE

    p4 = tf.add_paragraph()
    p4.alignment = PP_ALIGN.CENTER
    p4.text = "\n────────────────────────────────────────\n"
    p4.font.size = Pt(12)
    p4.font.color.rgb = BORDER_LIGHT

    p5 = tf.add_paragraph()
    p5.alignment = PP_ALIGN.CENTER
    p5.text = "Student Name: Lorn David   |   Student ID: DIT2024139   |   Class: PG-A"
    p5.font.bold = True
    p5.font.size = Pt(14)
    p5.font.color.rgb = TEXT_BLACK

    # ========================================================
    # SLIDE 2: HOMEWORK OVERVIEW
    # ========================================================
    slide2 = prs.slides.add_slide(blank_layout)
    apply_bg(slide2)
    add_header(slide2, "Homework Assignment & Architecture Overview", "Part 1 & 2 Requirements")

    tx = slide2.shapes.add_textbox(Inches(0.8), Inches(1.5), Inches(5.6), Inches(5.2))
    tf = tx.text_frame
    tf.word_wrap = True
    
    p = tf.paragraphs[0]
    p.text = "Requirement 1: 3 Docker Containers"
    p.font.bold = True
    p.font.size = Pt(15)
    p.font.color.rgb = PRIMARY

    bullets = [
        "1.1 Database (PostgreSQL 16) -> Port 5432",
        "1.2 Backend REST API (Node.js Express) -> Port 4000",
        "1.3 Frontend UI (Vue 3 + Nginx) -> Port 80"
    ]
    for b in bullets:
        pb = tf.add_paragraph()
        pb.text = f"•  {b}"
        pb.font.size = Pt(12)
        pb.font.color.rgb = TEXT_BLACK

    p_req2 = tf.add_paragraph()
    p_req2.text = "\nRequirement 2: Cloud VPS & Nginx Proxy Manager"
    p_req2.font.bold = True
    p_req2.font.size = Pt(15)
    p_req2.font.color.rgb = PRIMARY

    bullets2 = [
        "Cloud VPS: Ubuntu 24.04 LTS (IP: 147.93.111.196)",
        "Free Custom Domain: khmerapi.lorndavid.online",
        "Nginx Proxy Manager: Port 81 Web GUI + SSL",
        "All 3 containers pushed to Docker Hub: lorndavid"
    ]
    for b in bullets2:
        pb = tf.add_paragraph()
        pb.text = f"•  {b}"
        pb.font.size = Pt(12)
        pb.font.color.rgb = TEXT_BLACK

    add_screenshot_placeholder(slide2, Inches(6.8), Inches(1.5), Inches(5.7), Inches(5.2), "Screenshot: Project Architecture / Dockerfiles")

    # ========================================================
    # SLIDE 3: 1.1 DATABASE CONTAINER
    # ========================================================
    slide3 = prs.slides.add_slide(blank_layout)
    apply_bg(slide3)
    add_header(slide3, "1.1 Database Container (PostgreSQL 16)", "Requirement 1.1")

    tx = slide3.shapes.add_textbox(Inches(0.8), Inches(1.5), Inches(5.6), Inches(1.2))
    tf = tx.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "Image: lorndavid/khmerapi-database:latest\n" \
             "• Stores 25 provinces, 210 districts, 1,661 communes, 14,528 villages.\n" \
             "• Runs PostgreSQL 16 Alpine with health check on port 5432."
    p.font.size = Pt(12)
    p.font.color.rgb = TEXT_BLACK

    cmd_db = "# Pull & Run Database Container\n" \
             "docker pull lorndavid/khmerapi-database:latest\n\n" \
             "docker network create khmerapi-net 2>/dev/null || true\n\n" \
             "docker run -d \\\n" \
             "  --name khmerapi-database \\\n" \
             "  --network khmerapi-net \\\n" \
             "  -e POSTGRES_USER=postgres \\\n" \
             "  -e POSTGRES_PASSWORD=postgrespassword \\\n" \
             "  -e POSTGRES_DB=khmerapi \\\n" \
             "  -p 5432:5432 \\\n" \
             "  lorndavid/khmerapi-database:latest"
    add_code_box(slide3, Inches(0.8), Inches(2.7), Inches(5.6), Inches(4.0), cmd_db)
    add_screenshot_placeholder(slide3, Inches(6.8), Inches(1.5), Inches(5.7), Inches(5.2), "Screenshot: Database Container Running / Logs")

    # ========================================================
    # SLIDE 4: 1.2 BACKEND API CONTAINER
    # ========================================================
    slide4 = prs.slides.add_slide(blank_layout)
    apply_bg(slide4)
    add_header(slide4, "1.2 Backend REST API Container (Node.js Express)", "Requirement 1.2")

    tx = slide4.shapes.add_textbox(Inches(0.8), Inches(1.5), Inches(5.6), Inches(1.2))
    tf = tx.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "Image: lorndavid/khmerapi-backend:latest\n" \
             "• Node.js Express REST API server built with Prisma ORM.\n" \
             "• Connects to database and serves Cambodian geography data on port 4000."
    p.font.size = Pt(12)
    p.font.color.rgb = TEXT_BLACK

    cmd_backend = "# Pull & Run Backend Container\n" \
                  "docker pull lorndavid/khmerapi-backend:latest\n\n" \
                  "docker run -d \\\n" \
                  "  --name khmerapi-backend \\\n" \
                  "  --network khmerapi-net \\\n" \
                  "  -p 4000:4000 \\\n" \
                  "  -e DATABASE_URL=postgresql://postgres:postgrespassword@khmerapi-database:5432/khmerapi?schema=public \\\n" \
                  "  lorndavid/khmerapi-backend:latest"
    add_code_box(slide4, Inches(0.8), Inches(2.7), Inches(5.6), Inches(4.0), cmd_backend)
    add_screenshot_placeholder(slide4, Inches(6.8), Inches(1.5), Inches(5.7), Inches(5.2), "Screenshot: Backend API JSON (/v1/provinces or /health)")

    # ========================================================
    # SLIDE 5: 1.3 FRONTEND UI CONTAINER
    # ========================================================
    slide5 = prs.slides.add_slide(blank_layout)
    apply_bg(slide5)
    add_header(slide5, "1.3 Frontend Web UI Container (Vue 3 + Nginx)", "Requirement 1.3")

    tx = slide5.shapes.add_textbox(Inches(0.8), Inches(1.5), Inches(5.6), Inches(1.2))
    tf = tx.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "Image: lorndavid/khmerapi-frontend:latest\n" \
             "• Interactive Vue 3 Documentation and API Explorer interface.\n" \
             "• Built-in Nginx web server proxies /v1/ to backend container on port 80."
    p.font.size = Pt(12)
    p.font.color.rgb = TEXT_BLACK

    cmd_frontend = "# Pull & Run Frontend Container\n" \
                   "docker pull lorndavid/khmerapi-frontend:latest\n\n" \
                   "docker run -d \\\n" \
                   "  --name khmerapi-frontend \\\n" \
                   "  --network khmerapi-net \\\n" \
                   "  -p 80:80 \\\n" \
                   "  lorndavid/khmerapi-frontend:latest"
    add_code_box(slide5, Inches(0.8), Inches(2.7), Inches(5.6), Inches(4.0), cmd_frontend)
    add_screenshot_placeholder(slide5, Inches(6.8), Inches(1.5), Inches(5.7), Inches(5.2), "Screenshot: Frontend Website Running in Browser (http://localhost)")

    # ========================================================
    # SLIDE 6: VERIFICATION OF 3 CONTAINERS
    # ========================================================
    slide6 = prs.slides.add_slide(blank_layout)
    apply_bg(slide6)
    add_header(slide6, "Verification: Exactly 3 Containers Running", "Docker PS Check")

    tx = slide6.shapes.add_textbox(Inches(0.8), Inches(1.3), Inches(11.5), Inches(0.8))
    tf = tx.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "Command:  docker ps"
    p.font.name = "Consolas"
    p.font.bold = True
    p.font.size = Pt(14)
    p.font.color.rgb = PRIMARY

    add_screenshot_placeholder(slide6, Inches(0.8), Inches(2.1), Inches(11.7), Inches(4.7), "Screenshot: Terminal output of 'docker ps' showing all 3 containers UP")

    # ========================================================
    # SLIDE 7: REQUIREMENT 2 - VPS & DOMAIN
    # ========================================================
    slide7 = prs.slides.add_slide(blank_layout)
    apply_bg(slide7)
    add_header(slide7, "Requirement 2: Free Domain & Cloud VPS Setup", "Cloud Hosting")

    tx = slide7.shapes.add_textbox(Inches(0.8), Inches(1.5), Inches(5.6), Inches(5.2))
    tf = tx.text_frame
    tf.word_wrap = True
    
    p = tf.paragraphs[0]
    p.text = "Cloud Infrastructure Specifications:"
    p.font.bold = True
    p.font.size = Pt(14)
    p.font.color.rgb = PRIMARY

    vps_points = [
        "Cloud VPS: Ubuntu 24.04 LTS (Dedicated IP: 147.93.111.196)",
        "Domain: lorndavid.online",
        "Subdomain (API): khmerapi.lorndavid.online",
        "Subdomain (UI): khmer.lorndavid.online",
        "DNS Config: A-Record pointing domain to VPS IP address",
        "Security: Automatic SSL Certificate & HTTPS redirection"
    ]
    for pt in vps_points:
        pb = tf.add_paragraph()
        pb.text = f"•  {pt}"
        pb.font.size = Pt(11.5)
        pb.font.color.rgb = TEXT_BLACK

    add_screenshot_placeholder(slide7, Inches(6.8), Inches(1.5), Inches(5.7), Inches(5.2), "Screenshot: VPS Dashboard / DNS A-Record Configuration")

    # ========================================================
    # SLIDE 8: NGINX PROXY MANAGER
    # ========================================================
    slide8 = prs.slides.add_slide(blank_layout)
    apply_bg(slide8)
    add_header(slide8, "Running Nginx Proxy Manager on Docker", "Requirement 2 Tool")

    tx = slide8.shapes.add_textbox(Inches(0.8), Inches(1.5), Inches(5.6), Inches(1.2))
    tf = tx.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "Container: jc21/nginx-proxy-manager:latest\n" \
             "• Web GUI for managing reverse proxy hosts and SSL certificates.\n" \
             "• Admin Dashboard runs on port 81 (http://147.93.111.196:81)."
    p.font.size = Pt(12)
    p.font.color.rgb = TEXT_BLACK

    cmd_npm = "# Run Nginx Proxy Manager on VPS\n" \
              "docker run -d \\\n" \
              "  --name nginx-proxy-manager \\\n" \
              "  --restart always \\\n" \
              "  -p 80:80 \\\n" \
              "  -p 81:81 \\\n" \
              "  -p 443:443 \\\n" \
              "  -v npm_data:/data \\\n" \
              "  -v npm_letsencrypt:/etc/letsencrypt \\\n" \
              "  jc21/nginx-proxy-manager:latest"
    add_code_box(slide8, Inches(0.8), Inches(2.7), Inches(5.6), Inches(4.0), cmd_npm)
    add_screenshot_placeholder(slide8, Inches(6.8), Inches(1.5), Inches(5.7), Inches(5.2), "Screenshot: Nginx Proxy Manager Admin Dashboard (Port 81)")

    # ========================================================
    # SLIDE 9: LIVE PRODUCTION RESULT
    # ========================================================
    slide9 = prs.slides.add_slide(blank_layout)
    apply_bg(slide9)
    add_header(slide9, "Live Production Results (Hosted & Secure)", "Final Evaluation")

    tx = slide9.shapes.add_textbox(Inches(0.8), Inches(1.3), Inches(11.5), Inches(0.8))
    tf = tx.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "🌐 Live Website UI:  https://khmer.lorndavid.online    |    📡 Live REST API:  https://khmerapi.lorndavid.online/v1/provinces"
    p.font.bold = True
    p.font.size = Pt(12)
    p.font.color.rgb = PRIMARY

    add_screenshot_placeholder(slide9, Inches(0.8), Inches(2.1), Inches(11.7), Inches(4.7), "Screenshot: Live Browser Result with HTTPS SSL Padlock (khmer.lorndavid.online)")

    # ========================================================
    # SLIDE 10: CONCLUSION & THANK YOU
    # ========================================================
    slide10 = prs.slides.add_slide(blank_layout)
    apply_bg(slide10)

    card10 = slide10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(2.0), Inches(1.2), Inches(9.333), Inches(5.1))
    card10.fill.solid()
    card10.fill.fore_color.rgb = CARD_BG
    card10.line.color.rgb = BORDER_LIGHT
    card10.line.width = Pt(2)

    tf10 = card10.text_frame
    tf10.word_wrap = True
    tf10.vertical_anchor = MSO_ANCHOR.MIDDLE

    p = tf10.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    p.text = "ALL HOMEWORK REQUIREMENTS COMPLETED"
    p.font.bold = True
    p.font.size = Pt(16)
    p.font.color.rgb = PRIMARY

    p2 = tf10.add_paragraph()
    p2.alignment = PP_ALIGN.CENTER
    p2.text = "✓ 1.1 Database Container (PostgreSQL 16) Created & Pushed\n" \
              "✓ 1.2 Backend API Container (Node.js) Created & Pushed\n" \
              "✓ 1.3 Frontend UI Container (Vue 3) Created & Pushed\n" \
              "✓ 2.1 Free Domain & Cloud VPS Configured\n" \
              "✓ 2.2 Nginx Proxy Manager & Live HTTPS Web App Operational"
    p2.font.size = Pt(13)
    p2.font.color.rgb = TEXT_BLACK

    p3 = tf10.add_paragraph()
    p3.alignment = PP_ALIGN.CENTER
    p3.text = "\nTHANK YOU"
    p3.font.bold = True
    p3.font.size = Pt(36)
    p3.font.color.rgb = ACCENT_GREEN

    try:
        prs.save(output_path)
        print(f"White background presentation saved successfully to: {output_path}")
    except PermissionError:
        alt_path = output_path.replace(".pptx", "-White.pptx")
        prs.save(alt_path)
        print(f"File was open in PowerPoint. Saved to alternative path: {alt_path}")

if __name__ == "__main__":
    out_file = r"d:\Developer Project\homework\Homework-Docker-Presentation.pptx"
    create_slides(out_file)
