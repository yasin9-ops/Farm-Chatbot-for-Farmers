import React, { useState } from 'react';
import { FileText, CheckCircle2, ExternalLink, ChevronDown, ChevronUp, IndianRupee, Users, Calendar } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface Scheme {
  id: string;
  name: string;
  nameTE: string;
  description: string;
  descriptionTE: string;
  benefits: string[];
  benefitsTE: string[];
  eligibility: string[];
  eligibilityTE: string[];
  amount?: string;
  category: 'central' | 'state';
  link?: string;
}

const schemes: Scheme[] = [
  {
    id: '1',
    name: 'PM-KISAN',
    nameTE: 'పీఎం-కిసాన్',
    description: 'Direct income support of ₹6,000 per year to farmer families with cultivable land.',
    descriptionTE: 'సాగు భూమి ఉన్న రైతు కుటుంబాలకు సంవత్సరానికి ₹6,000 ప్రత్యక్ష ఆదాయ మద్దతు.',
    benefits: ['₹6,000 per year in 3 installments', 'Direct bank transfer', 'No middlemen'],
    benefitsTE: ['సంవత్సరానికి ₹6,000 3 వాయిదాలలో', 'నేరుగా బ్యాంకు బదిలీ', 'మధ్యవర్తులు లేరు'],
    eligibility: ['All farmer families with cultivable land', 'Valid Aadhaar card', 'Bank account'],
    eligibilityTE: ['సాగు భూమి ఉన్న అన్ని రైతు కుటుంబాలు', 'చెల్లుబాటు అయ్యే ఆధార్ కార్డు', 'బ్యాంక్ ఖాతా'],
    amount: '₹6,000/year',
    category: 'central',
    link: 'https://pmkisan.gov.in/',
  },
  {
    id: '2',
    name: 'Rythu Bandhu',
    nameTE: 'రైతు బంధు',
    description: 'Investment support scheme providing ₹10,000 per acre per year to farmers.',
    descriptionTE: 'రైతులకు సంవత్సరానికి ఎకరాకు ₹10,000 పెట్టుబడి మద్దతు పథకం.',
    benefits: ['₹10,000 per acre annually', 'Twice a year payment', 'No loan burden'],
    benefitsTE: ['సంవత్సరానికి ఎకరాకు ₹10,000', 'సంవత్సరానికి రెండుసార్లు చెల్లింపు', 'రుణ భారం లేదు'],
    eligibility: ['Farmers in Telangana', 'Land ownership proof', 'Aadhaar linked bank account'],
    eligibilityTE: ['తెలంగాణలో రైతులు', 'భూమి యాజమాన్య రుజువు', 'ఆధార్ లింక్డ్ బ్యాంక్ ఖాతా'],
    amount: '₹10,000/acre',
    category: 'state',
    link: 'https://rythubandhu.telangana.gov.in/',
  },
  {
    id: '3',
    name: 'Pradhan Mantri Fasal Bima Yojana',
    nameTE: 'ప్రధాన మంత్రి ఫసల్ బీమా యోజన',
    description: 'Crop insurance scheme to protect farmers against crop loss due to natural calamities.',
    descriptionTE: 'సహజ విపత్తుల వల్ల పంట నష్టం నుండి రైతులను రక్షించే పంట బీమా పథకం.',
    benefits: ['Low premium rates', 'Full sum insured coverage', 'Quick claim settlement'],
    benefitsTE: ['తక్కువ ప్రీమియం రేట్లు', 'పూర్తి బీమా మొత్తం కవరేజ్', 'త్వరిత క్లెయిమ్ పరిష్కారం'],
    eligibility: ['All farmers growing notified crops', 'Loanee and non-loanee farmers', 'Valid land records'],
    eligibilityTE: ['నోటిఫైడ్ పంటలు పండించే అన్ని రైతులు', 'రుణగ్రహీత మరియు రుణగ్రహీత కాని రైతులు', 'చెల్లుబాటు అయ్యే భూమి రికార్డులు'],
    amount: '2% premium for Kharif',
    category: 'central',
    link: 'https://pmfby.gov.in/',
  },
  {
    id: '4',
    name: 'Kisan Credit Card',
    nameTE: 'కిసాన్ క్రెడిట్ కార్డ్',
    description: 'Credit facility for farmers to meet their agricultural and consumption needs.',
    descriptionTE: 'రైతుల వ్యవసాయ మరియు వినియోగ అవసరాలను తీర్చడానికి క్రెడిట్ సౌకర్యం.',
    benefits: ['4% interest rate', 'Flexible repayment', 'Covers all farming needs'],
    benefitsTE: ['4% వడ్డీ రేటు', 'అనువైన తిరిగి చెల్లింపు', 'అన్ని వ్యవసాయ అవసరాలను కవర్ చేస్తుంది'],
    eligibility: ['Owner cultivators', 'Tenant farmers', 'Share croppers'],
    eligibilityTE: ['యజమాని సాగుదారులు', 'కౌలు రైతులు', 'భాగస్వామ్య రైతులు'],
    amount: 'Up to ₹3 lakh',
    category: 'central',
    link: 'https://www.nabard.org/KCC',
  },
  {
    id: '5',
    name: 'Soil Health Card Scheme',
    nameTE: 'సాయిల్ హెల్త్ కార్డ్ స్కీం',
    description: 'Free soil testing and recommendations for balanced fertilizer use.',
    descriptionTE: 'ఉచిత నేల పరీక్ష మరియు సమతుల్య ఎరువు వినియోగం కోసం సిఫార్సులు.',
    benefits: ['Free soil testing', 'Nutrient-based recommendations', 'Improved crop yield'],
    benefitsTE: ['ఉచిత నేల పరీక్ష', 'పోషకాల ఆధారిత సిఫార్సులు', 'మెరుగైన పంట దిగుబడి'],
    eligibility: ['All farmers', 'Land owners and tenants', 'No documentation required'],
    eligibilityTE: ['అన్ని రైతులు', 'భూ యజమానులు మరియు కౌలుదారులు', 'డాక్యుమెంటేషన్ అవసరం లేదు'],
    amount: 'Free service',
    category: 'central',
    link: 'https://soilhealth.dac.gov.in/',
  },
];

const Schemes: React.FC = () => {
  const { language } = useLanguage();
  const [expandedScheme, setExpandedScheme] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'central' | 'state'>('all');

  const filteredSchemes = schemes.filter(
    (scheme) => filter === 'all' || scheme.category === filter
  );

  const toggleScheme = (id: string) => {
    setExpandedScheme(expandedScheme === id ? null : id);
  };

  return (
    <Layout>
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
              <FileText className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                {language === 'te' ? 'ప్రభుత్వ పథకాలు' : 'Government Schemes'}
              </span>
            </div>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              {language === 'te' ? 'రైతుల కోసం పథకాలు' : 'Schemes for Farmers'}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {language === 'te' 
                ? 'రైతులకు అందుబాటులో ఉన్న కేంద్ర మరియు రాష్ట్ర ప్రభుత్వ పథకాలను అన్వేషించండి'
                : 'Explore central and state government schemes available for farmers'}
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex justify-center gap-2">
              {[
                { id: 'all', name: 'All Schemes', nameTE: 'అన్ని పథకాలు' },
                { id: 'central', name: 'Central Govt', nameTE: 'కేంద్ర ప్రభుత్వం' },
                { id: 'state', name: 'State Govt', nameTE: 'రాష్ట్ర ప్రభుత్వం' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onClick={() => setFilter(tab.id as any)}
                  className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    filter === tab.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80 text-foreground'
                  }`}
                >
                  {language === 'te' ? tab.nameTE : tab.name}
                </button>
              ))}
            </div>
          </div>

          {/* Schemes List */}
          <div className="max-w-4xl mx-auto space-y-4">
            {filteredSchemes.map((scheme, index) => (
              <div
                key={scheme.id}
                className="feature-card cursor-pointer animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => toggleScheme(scheme.id)}
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                      scheme.category === 'central' ? 'bg-primary/10' : 'bg-leaf/10'
                    )}>
                      <FileText className={cn(
                        "h-6 w-6",
                        scheme.category === 'central' ? 'text-primary' : 'text-leaf'
                      )} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-heading font-semibold text-lg text-foreground">
                          {language === 'te' ? scheme.nameTE : scheme.name}
                        </h3>
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-xs font-medium",
                          scheme.category === 'central' 
                            ? 'bg-primary/10 text-primary' 
                            : 'bg-leaf/10 text-leaf'
                        )}>
                          {scheme.category === 'central' 
                            ? (language === 'te' ? 'కేంద్రం' : 'Central')
                            : (language === 'te' ? 'రాష్ట్రం' : 'State')}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {language === 'te' ? scheme.descriptionTE : scheme.description}
                      </p>
                      {scheme.amount && (
                        <div className="flex items-center gap-1 mt-2 text-sm font-medium text-wheat">
                          <IndianRupee className="h-4 w-4" />
                          {scheme.amount}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {expandedScheme === scheme.id ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedScheme === scheme.id && (
                  <div className="mt-6 pt-6 border-t border-border space-y-6 animate-fade-in">
                    {/* Benefits */}
                    <div>
                      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-leaf" />
                        {language === 'te' ? 'ప్రయోజనాలు' : 'Benefits'}
                      </h4>
                      <ul className="space-y-2">
                        {(language === 'te' ? scheme.benefitsTE : scheme.benefits).map((benefit, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-leaf mt-1.5 flex-shrink-0" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Eligibility */}
                    <div>
                      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Users className="h-4 w-4 text-sky" />
                        {language === 'te' ? 'అర్హత' : 'Eligibility'}
                      </h4>
                      <ul className="space-y-2">
                        {(language === 'te' ? scheme.eligibilityTE : scheme.eligibility).map((item, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-sky mt-1.5 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Apply Button */}
                    {scheme.link && (
                      <Button
                        variant="outline"
                        className="w-full sm:w-auto"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(scheme.link, '_blank');
                        }}
                      >
                        <ExternalLink className="h-4 w-4" />
                        {language === 'te' ? 'దరఖాస్తు చేయండి' : 'Apply Now'}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Schemes;
