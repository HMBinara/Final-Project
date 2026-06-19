import io
from PIL import Image, ImageDraw
import requests
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image as RLImage, PageBreak
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
import google.generativeai as genai
import os
from datetime import datetime

class ReportGenerator:
    """Generate professional PDF reports with AI-generated header images"""
    
    def __init__(self, gemini_api_key=None):
        self.gemini_api_key = gemini_api_key or os.getenv('GEMINI_API_KEY')
        if self.gemini_api_key:
            genai.configure(api_key=self.gemini_api_key)
    
    def determine_warning_level(self, longevity, health_condition, financial_status):
        """Determine overall warning level (CRITICAL, WARNING, CAUTION, GOOD, EXCELLENT)"""
        longevity_val = int(longevity.split()[0])
        financial_val = float(financial_status)
        
        # Calculate severity score
        health_severity = 0
        if health_condition == 'Normal':
            health_severity = 1
        elif health_condition in ['Insomnia', 'Sleep Apnea']:
            health_severity = 2
        else:
            health_severity = 3
        
        longevity_severity = 0
        if longevity_val >= 80:
            longevity_severity = 1
        elif longevity_val >= 65:
            longevity_severity = 2
        else:
            longevity_severity = 3
        
        financial_severity = 0
        if financial_val > 15:
            financial_severity = 1
        elif financial_val > 10:
            financial_severity = 2
        else:
            financial_severity = 3
        
        avg_severity = (health_severity + longevity_severity + financial_severity) / 3
        
        if avg_severity >= 2.7:
            return 'CRITICAL', '#E63946'
        elif avg_severity >= 2.3:
            return 'WARNING', '#F77F00'
        elif avg_severity >= 1.7:
            return 'CAUTION', '#FCBF49'
        elif avg_severity >= 1.3:
            return 'GOOD', '#06D6A0'
        else:
            return 'EXCELLENT', '#118AB2'
    
    def generate_header_image_with_gemini(self, warning_level, color):
        """Generate a header image using Gemini API"""
        try:
            model = genai.GenerativeModel('gemini-pro-vision')
            
            # Create a detailed prompt for header image generation
            prompt = f"""Create a professional health report header image description for a '{warning_level}' status report.
The status is {warning_level}.
Color theme: {color}
Style: Modern, professional, medical/health themed
Include: Symbolic icons representing health analysis, longevity, and financial stability
Dimensions: 800x200 pixels
Format: Describe what should be in this header image for a health balance report."""
            
            # For image generation via API, we'll use a fallback approach
            # Since Gemini API doesn't directly generate images in this version,
            # we'll create a styled header programmatically
            return self.create_styled_header_image(warning_level, color)
        
        except Exception as e:
            print(f"⚠️ Gemini image generation error: {e}")
            return self.create_styled_header_image(warning_level, color)
    
    def create_styled_header_image(self, warning_level, color):
        """Create a styled header image programmatically"""
        width, height = 800, 200
        image = Image.new('RGB', (width, height), color='white')
        draw = ImageDraw.Draw(image)
        
        # Parse hex color
        color_rgb = tuple(int(color.lstrip('#')[i:i+2], 16) for i in (0, 2, 4))
        
        # Draw gradient-like background
        for y in range(height):
            # Gradient from darker to lighter
            intensity = int(255 - (y / height) * 50)
            alpha = int(y / height * 255)
            r = min(255, int(color_rgb[0] + (255 - color_rgb[0]) * (y / height)))
            g = min(255, int(color_rgb[1] + (255 - color_rgb[1]) * (y / height)))
            b = min(255, int(color_rgb[2] + (255 - color_rgb[2]) * (y / height)))
            draw.line([(0, y), (width, y)], fill=(r, g, b))
        
        # Draw status text
        text = f"Life Balance Intelligence Report - {warning_level} Status"
        text_color = 'white' if warning_level in ['CRITICAL', 'WARNING'] else 'white'
        
        # Simple text positioning (centered)
        draw.text((width//2 - 200, height//2 - 20), text, fill=text_color)
        
        # Convert to bytes
        img_bytes = io.BytesIO()
        image.save(img_bytes, format='PNG')
        img_bytes.seek(0)
        
        return img_bytes
    
    def generate_pdf(self, longevity, health_condition, financial_status):
        """Generate a professional PDF report"""
        warning_level, color = self.determine_warning_level(
            longevity, health_condition, financial_status
        )
        
        # Create PDF in memory
        pdf_buffer = io.BytesIO()
        doc = SimpleDocTemplate(pdf_buffer, pagesize=letter)
        elements = []
        
        # Get styles
        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=28,
            textColor=colors.HexColor(color),
            spaceAfter=30,
            alignment=TA_CENTER,
            fontName='Helvetica-Bold'
        )
        
        heading_style = ParagraphStyle(
            'CustomHeading',
            parent=styles['Heading2'],
            fontSize=16,
            textColor=colors.HexColor(color),
            spaceAfter=12,
            spaceBefore=12,
            fontName='Helvetica-Bold'
        )
        
        body_style = ParagraphStyle(
            'CustomBody',
            parent=styles['BodyText'],
            fontSize=11,
            alignment=TA_JUSTIFY,
            spaceAfter=12
        )
        
        # Add header image
        try:
            header_img = self.generate_header_image_with_gemini(warning_level, color)
            rl_image = RLImage(header_img, width=7*inch, height=1.75*inch)
            elements.append(rl_image)
            elements.append(Spacer(1, 0.3*inch))
        except Exception as e:
            print(f"⚠️ Header image error: {e}")
        
        # Title
        title = Paragraph("LIFE BALANCE INTELLIGENCE REPORT", title_style)
        elements.append(title)
        elements.append(Spacer(1, 0.2*inch))
        
        # Status badge
        status_color = colors.HexColor(color)
        status_data = [
            [Paragraph(f"<b>OVERALL STATUS: {warning_level}</b>", heading_style)]
        ]
        status_table = Table(status_data, colWidths=[7*inch])
        status_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), status_color),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 14),
            ('PADDING', (0, 0), (-1, -1), 15),
            ('TOPPADDING', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
        ]))
        elements.append(status_table)
        elements.append(Spacer(1, 0.3*inch))
        
        # Bio-Longevity Section
        elements.append(Paragraph("📊 BIO-LONGEVITY ANALYSIS", heading_style))
        longevity_text = f"""
        Your projected lifespan based on lifestyle and health metrics: <b>{longevity}</b>
        """
        elements.append(Paragraph(longevity_text, body_style))
        if int(longevity.split()[0]) >= 80:
            elements.append(Paragraph("✅ <b>INSIGHT:</b> Excellent lifestyle! Maintain these habits for a long, healthy life.", body_style))
        elif int(longevity.split()[0]) >= 65:
            elements.append(Paragraph("⚠️ <b>INSIGHT:</b> Good outlook. Increasing physical activity could further improve your longevity.", body_style))
        else:
            elements.append(Paragraph("🔴 <b>INSIGHT:</b> Warning! Significant lifestyle changes needed. Focus on diet and consistent sleep patterns.", body_style))
        elements.append(Spacer(1, 0.2*inch))
        
        # Clinical Health Section
        elements.append(Paragraph("❤️ CLINICAL HEALTH STATE", heading_style))
        health_text = f"Diagnostic result: <b>{health_condition}</b>"
        elements.append(Paragraph(health_text, body_style))
        if health_condition == 'Normal':
            elements.append(Paragraph("✅ <b>STATUS:</b> GOOD - You are in a healthy clinical state. Keep up the preventive care.", body_style))
        elif health_condition in ['Insomnia', 'Sleep Apnea']:
            elements.append(Paragraph("⚠️ <b>STATUS:</b> WARNING - Poor sleep detected. Try to reduce stress and aim for a consistent sleep schedule.", body_style))
        else:
            elements.append(Paragraph("🔴 <b>STATUS:</b> BAD - Potential health risk detected. We recommend consulting a healthcare professional.", body_style))
        elements.append(Spacer(1, 0.2*inch))
        
        # Financial Stability Section
        elements.append(Paragraph("💰 FINANCIAL STABILITY", heading_style))
        financial_text = f"Resilience Score: <b>{financial_status}</b>"
        elements.append(Paragraph(financial_text, body_style))
        fin_val = float(financial_status)
        if fin_val > 15:
            elements.append(Paragraph("✅ <b>OUTLOOK:</b> Strong financial stability! You are in a great position for long-term investments.", body_style))
        elif fin_val > 10:
            elements.append(Paragraph("⚠️ <b>OUTLOOK:</b> Stable, but there's room for growth. Consider increasing your monthly savings.", body_style))
        else:
            elements.append(Paragraph("🔴 <b>OUTLOOK:</b> Financial risk detected. Focus on debt reduction and building an emergency fund.", body_style))
        elements.append(Spacer(1, 0.3*inch))
        
        # Recommendations
        elements.append(Paragraph("📋 PERSONALIZED RECOMMENDATIONS", heading_style))
        recommendations = [
            "• Review your daily sleep schedule and aim for 7-8 hours consistently",
            "• Increase physical activity to at least 30 minutes per day",
            "• Manage stress through meditation or mindfulness exercises",
            "• Review financial goals and adjust savings strategy quarterly",
            "• Schedule regular health checkups with your healthcare provider"
        ]
        for rec in recommendations:
            elements.append(Paragraph(rec, body_style))
        
        elements.append(Spacer(1, 0.3*inch))
        
        # Footer
        footer_text = f"Generated on {datetime.now().strftime('%B %d, %Y at %I:%M %p')} | LifeBalance Intelligence System v2.0"
        footer_style = ParagraphStyle(
            'Footer',
            parent=styles['Normal'],
            fontSize=9,
            textColor=colors.grey,
            alignment=TA_CENTER
        )
        elements.append(Paragraph(footer_text, footer_style))
        
        # Build PDF
        doc.build(elements)
        pdf_buffer.seek(0)
        
        return pdf_buffer
