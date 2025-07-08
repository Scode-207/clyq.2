import type { Express } from "express";
import multer from "multer";
import { zenSerpMedicalService } from "../services/zenserp-medical-service";
import { geminiMedicalService } from "../services/gemini-medical-service";
import { locationService } from "../services/location-service";

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images and PDFs
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and PDFs are allowed.'));
    }
  }
});

export function registerMediGroqRoutes(app: Express) {
  
  // New chat endpoint using Gemini AI
  app.post('/api/medigroq/chat', upload.single('file'), async (req, res) => {
    try {
      const message = req.body.message;
      const file = req.file;
      let response;

      if (file) {
        // Handle file upload - analyze prescription with Gemini
        const analysis = await geminiMedicalService.analyzePrescriptionFromFile(file.path);
        
        response = {
          content: `## 🔬 Prescription Analysis Complete

I've analyzed your prescription using advanced AI. Here's what I found:

### 💊 Medications Identified:
${analysis.medications.map(med => `
**${med.name}** (${med.dosage})
- **Purpose:** ${med.purpose}
- **Frequency:** ${med.frequency}
- **Duration:** ${med.duration}
- **Generic Alternatives:** ${med.genericAlternatives.join(', ') || 'None listed'}
`).join('')}

### 📋 Doctor Information:
- **Doctor:** ${analysis.doctorInfo.name}
- **Specialty:** ${analysis.doctorInfo.specialty}
- **Contact:** ${analysis.doctorInfo.contact}

### 🎯 Analysis Summary:
${analysis.analysis.summary}

### ⚠️ Important Concerns:
${analysis.analysis.concerns.map(concern => `- ${concern}`).join('\n')}

### 💡 Recommendations:
${analysis.analysis.recommendations.map(rec => `- ${rec}`).join('\n')}

### 💰 Cost-Saving Tips:
${analysis.analysis.costSavingTips.map(tip => `- ${tip}`).join('\n')}

---
⚠️ **Medical Disclaimer:** ${analysis.disclaimer}`,
          suggestions: []
        };
      } else {
        // Handle text message - medical research with Gemini + facility search with ZenSERP
        const clientIp = req.ip || '127.0.0.1';
        const userLocation = await locationService.getUserLocationFromIP(clientIp);
        const locationString = userLocation?.city || 'San Francisco';

        if (message.toLowerCase().includes('hospital') || message.toLowerCase().includes('clinic') || 
            message.toLowerCase().includes('doctor') || message.toLowerCase().includes('medical facility')) {
          
          // Search for medical facilities using ZenSERP
          const facilities = await zenSerpMedicalService.searchMedicalFacilities(locationString, 'hospital');
          
          response = {
            content: `## 🏥 Comprehensive Medical Facilities Guide for ${locationString}

I've compiled a detailed analysis of top medical facilities in your area with verified information, ratings, and reviews:

${facilities.slice(0, 4).map((facility, index) => `
### ${index + 1}. ${facility.name}
**📍 Address:** ${facility.address}  
**🚗 Distance:** ${facility.distance.toFixed(1)} miles from your location  
**⭐ Patient Rating:** ${facility.rating}/5.0 stars based on ${facility.reviews.toLocaleString()} verified reviews  
**💰 Cost Level:** ${facility.priceRange} ($ = Budget-friendly, $$ = Moderate, $$$ = Premium)  
**⏰ Typical Wait Time:** ${facility.waitTime}  
**🕒 Operating Hours:** ${facility.hours}  
**📞 Direct Contact:** ${facility.phone}  

**🏥 Medical Specialties Available:**
${facility.specialties.map(spec => `• ${spec}`).join('\n')}

**💼 Insurance Coverage:**
${facility.insurance.map(ins => `• ${ins}`).join('\n')}

**🔬 Services & Facilities:**
${facility.services.map(service => `• ${service}`).join('\n')}

**📸 Visual Reference:** ${facility.imageUrl ? '[Facility Images Available]' : 'Contact for facility tour'}

---
`).join('')}

### 🎯 Professional Medical Guidance:

**Before Your Visit:**
• **Call Ahead:** Verify current wait times and appointment availability
• **Insurance Verification:** Confirm your insurance is accepted and coverage details
• **Medical Records:** Bring current medications list, allergies, and recent test results
• **Symptom Documentation:** Note when symptoms started, severity, and triggers

**During Your Visit:**
• **Be Specific:** Describe symptoms clearly with timeline and severity (1-10 scale)
• **Ask Questions:** Don't hesitate to ask about treatment options, side effects, and follow-up care
• **Take Notes:** Write down diagnoses, medication names, and instructions
• **Request Summaries:** Ask for written discharge instructions or visit summaries

**Cost Optimization:**
• **Generic Medications:** Ask about generic alternatives to save 60-80% on prescriptions
• **Payment Plans:** Many facilities offer payment plans for larger bills
• **Preventive Care:** Use insurance benefits for annual check-ups and screenings
• **Urgent Care vs ER:** Choose urgent care for non-life-threatening conditions to save costs

**Quality Indicators to Consider:**
• **Board Certification:** Ensure doctors are board-certified in their specialties
• **Hospital Affiliations:** Check which hospitals the doctors are affiliated with
• **Patient Reviews:** Read recent patient experiences and outcomes
• **Accreditation:** Look for Joint Commission or other quality accreditations

⚠️ **Important Medical Disclaimer:** This information is compiled for reference purposes only. Always consult with qualified healthcare professionals for medical decisions, diagnoses, and treatment plans. In case of medical emergencies, call 911 immediately.`,
            suggestions: facilities.slice(0, 3).map(f => ({
              type: 'facility' as const,
              title: f.name,
              description: `${f.type} • ${f.distance.toFixed(1)}mi • $${f.priceRange} • ${f.rating}⭐`,
              data: f
            }))
          };

        } else if (message.toLowerCase().includes('medication') || message.toLowerCase().includes('medicine') || 
                   message.toLowerCase().includes('prescription') || message.toLowerCase().includes('pharmacy')) {
          
          // Search for medications using ZenSERP
          const medications = await zenSerpMedicalService.searchMedicalProducts('medication', locationString);
          
          response = {
            content: `## 💊 Comprehensive Medication Pricing & Pharmacy Analysis for ${locationString}

I've conducted a thorough price comparison analysis across major pharmacies in your area with real-time availability data:

${medications.slice(0, 4).map((med, index) => `
### ${index + 1}. ${med.name}
**🏪 Pharmacy Chain:** ${med.pharmacy}  
**📍 Location:** ${med.address} (${med.distance.toFixed(1)} miles from you)  
**💰 Current Price:** $${med.price.toFixed(2)}  
**📦 Stock Status:** ${med.inStock ? '✅ Currently Available' : '❌ Temporarily Out of Stock'}  
**🔄 Generic Option:** ${med.genericAvailable ? 'Yes - Save up to 85%' : 'Brand name only'}  
**📸 Product Reference:** ${med.imageUrl ? '[Medication Images Available]' : 'Ask pharmacist for product details'}

---
`).join('')}

### 💰 Advanced Cost-Saving Strategies:

**Immediate Savings (Up to 90% Off):**
• **Generic Substitutions:** Ask for generic versions - typically 60-85% cheaper than brand names
• **Pharmacy Discount Programs:** 
  - GoodRx: Free discount cards for uninsured patients
  - SingleCare: Additional savings on top of insurance
  - Pharmacy-specific programs: CVS ExtraCare, Walgreens myWalgreens
• **90-Day Supplies:** Order larger quantities for better per-pill pricing
• **Mail-Order Pharmacies:** Often 20-30% cheaper for maintenance medications

**Insurance Optimization:**
• **Formulary Check:** Ensure medications are on your insurance's preferred list
• **Prior Authorization:** Work with doctors to get expensive medications pre-approved
• **Step Therapy:** Start with lower-cost alternatives as required by insurance
• **Appeal Process:** Challenge insurance denials with your doctor's help

**Alternative Medication Programs:**
• **Patient Assistance Programs:** Direct manufacturer discounts for qualifying patients
• **$4 Generic Lists:** Walmart, Target, and others offer common generics for $4
• **Pharmacy School Clinics:** Discounted services and medications
• **Community Health Centers:** Sliding scale pricing based on income

**Professional Pharmacy Services:**
• **Medication Therapy Management:** Free consultations to optimize your drug regimen
• **Adherence Packaging:** Pill packs and reminders to ensure proper medication taking
• **Drug Interaction Checks:** Comprehensive safety reviews of all your medications
• **Immunizations:** Convenient vaccine services at most pharmacies

**Red Flags to Avoid:**
• **Online Pharmacies:** Only use verified, licensed online pharmacies
• **Too-Good-to-Be-True Prices:** Extremely low prices may indicate counterfeit medications
• **No Prescription Required:** Legitimate prescription medications always require valid prescriptions
• **Foreign Suppliers:** Avoid importing medications without proper regulatory approval

### 🔍 Price Comparison Strategy:
1. **Get Generic Names:** Ask your doctor for generic medication names
2. **Call Multiple Pharmacies:** Prices can vary significantly between locations
3. **Check Discount Apps:** Compare GoodRx, SingleCare, and RxSaver prices
4. **Consider Independent Pharmacies:** Often more competitive and personalized service
5. **Ask About Price Matching:** Some pharmacies will match competitor prices

⚠️ **Critical Medical Safety Notice:** Never compromise on medication quality for price savings. Always verify medications with licensed pharmacists, check for proper packaging and labeling, and report any adverse effects to your healthcare provider immediately. This pricing information is for reference only and should be verified directly with pharmacies.`,
            suggestions: medications.slice(0, 3).map(m => ({
              type: 'medication' as const,
              title: m.name,
              description: `${m.pharmacy} • $${m.price} • ${m.distance.toFixed(1)}mi • ${m.inStock ? 'In Stock' : 'Out of Stock'}`,
              data: m
            }))
          };

        } else {
          // General medical research using Gemini
          const research = await geminiMedicalService.researchMedicalCondition(message);
          
          response = {
            content: `## 📚 Medical Research: ${research.condition}

### Overview:
${research.overview}

### 🔍 Common Symptoms:
${research.symptoms.map(symptom => `- ${symptom}`).join('\n')}

### 💊 Treatment Options:
${research.treatments.map(treatment => `
**${treatment.name}** (${treatment.type})
- **Effectiveness:** ${treatment.effectiveness}
- **Side Effects:** ${treatment.sideEffects.join(', ')}
`).join('')}

### 🛡️ Preventive Measures:
${research.preventiveMeasures.map(measure => `- ${measure}`).join('\n')}

### 🚨 When to Seek Medical Help:
${research.whenToSeekHelp.map(situation => `- ${situation}`).join('\n')}

### 📖 Sources:
${research.sources.map(source => `- ${source}`).join('\n')}

---
⚠️ **Medical Disclaimer:** ${research.disclaimer}`,
            suggestions: []
          };
        }
      }

      res.json(response);
    } catch (error) {
      console.error('MediGroq chat error:', error);
      res.status(500).json({
        content: "I apologize, but I'm experiencing technical difficulties. Please try again or consult with a healthcare professional directly.",
        suggestions: []
      });
    }
  });
  // Prescription analysis endpoint
  app.post('/api/medigroq/analyze-prescription', upload.single('prescription'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const analysis = await geminiMedicalService.analyzePrescriptionFromFile(req.file.path);
      
      // Clean up uploaded file
      const fs = await import('fs');
      fs.unlinkSync(req.file.path);
      
      res.json(analysis);
    } catch (error) {
      console.error('Prescription analysis error:', error);
      res.status(500).json({ error: 'Failed to analyze prescription' });
    }
  });

  // Medical facility search endpoint
  app.get('/api/medigroq/search-facilities', async (req, res) => {
    try {
      const { location, type = 'hospital', specialty, insurance } = req.query;
      
      if (!location) {
        return res.status(400).json({ error: 'Location is required' });
      }

      const facilities = await zenSerpMedicalService.searchMedicalFacilities(
        location as string,
        type as string,
        {
          specialty: specialty as string,
          insurance: insurance as string,
        }
      );

      res.json(facilities);
    } catch (error) {
      console.error('Medical facility search error:', error);
      res.status(500).json({ error: 'Failed to search medical facilities' });
    }
  });

  // Medical product/medication search endpoint
  app.get('/api/medigroq/search-products', async (req, res) => {
    try {
      const { medication, location, pharmacy } = req.query;
      
      if (!medication || !location) {
        return res.status(400).json({ error: 'Medication and location are required' });
      }

      const products = await zenSerpMedicalService.searchMedicalProducts(
        medication as string,
        location as string,
        {
          pharmacy: pharmacy as string,
        }
      );

      res.json(products);
    } catch (error) {
      console.error('Medical product search error:', error);
      res.status(500).json({ error: 'Failed to search medical products' });
    }
  });

  // Medical research endpoint
  app.post('/api/medigroq/research-condition', async (req, res) => {
    try {
      const { condition } = req.body;
      
      if (!condition) {
        return res.status(400).json({ error: 'Medical condition is required' });
      }

      const research = await geminiMedicalService.researchMedicalCondition(condition);
      res.json(research);
    } catch (error) {
      console.error('Medical research error:', error);
      res.status(500).json({ error: 'Failed to research medical condition' });
    }
  });

  // Medication comparison endpoint
  app.post('/api/medigroq/compare-medications', async (req, res) => {
    try {
      const { medications } = req.body;
      
      if (!medications || !Array.isArray(medications)) {
        return res.status(400).json({ error: 'Medications array is required' });
      }

      const comparison = await geminiMedicalService.compareMedications(medications);
      res.json(comparison);
    } catch (error) {
      console.error('Medication comparison error:', error);
      res.status(500).json({ error: 'Failed to compare medications' });
    }
  });

  // Get facility images endpoint
  app.get('/api/medigroq/facility-images', async (req, res) => {
    try {
      const { facilityName, location } = req.query;
      
      if (!facilityName || !location) {
        return res.status(400).json({ error: 'Facility name and location are required' });
      }

      const images = await zenSerpMedicalService.getMedicalFacilityImages(
        facilityName as string,
        location as string
      );

      res.json({ images });
    } catch (error) {
      console.error('Facility images error:', error);
      res.status(500).json({ error: 'Failed to get facility images' });
    }
  });
}