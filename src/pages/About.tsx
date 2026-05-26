import React from 'react';
import { Cpu, TrendingUp, Users, Leaf, Smartphone, Globe, Lightbulb, GraduationCap } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';

const About: React.FC = () => {
  const { language } = useLanguage();

  const technologies = [
    {
      icon: Cpu,
      title: language === 'te' ? 'కృత్రిమ మేధస్సు' : 'Artificial Intelligence',
      description: language === 'te' 
        ? 'స్మార్ట్ సిఫార్సులు మరియు అంచనాల కోసం అధునాతన AI అల్గారిథమ్‌లు'
        : 'Advanced AI algorithms for smart recommendations and predictions',
    },
    {
      icon: TrendingUp,
      title: language === 'te' ? 'మెషిన్ లెర్నింగ్' : 'Machine Learning',
      description: language === 'te'
        ? 'పంట దిగుబడి, వ్యాధి గుర్తింపు మరియు ధర అంచనా కోసం ML మోడల్‌లు'
        : 'ML models for crop yield, disease detection, and price prediction',
    },
    {
      icon: Globe,
      title: language === 'te' ? 'నిజ-సమయ డేటా' : 'Real-time Data',
      description: language === 'te'
        ? 'వాతావరణం మరియు మార్కెట్ ధరల కోసం API ఇంటిగ్రేషన్'
        : 'Live API integration for weather and market prices',
    },
    {
      icon: Smartphone,
      title: language === 'te' ? 'మొబైల్ ఫ్రెండ్లీ' : 'Mobile Friendly',
      description: language === 'te'
        ? 'అన్ని పరికరాల్లో సులభంగా ఉపయోగించగల డిజైన్'
        : 'Easy-to-use design that works on all devices',
    },
  ];

  const benefits = [
    {
      icon: Leaf,
      title: language === 'te' ? 'మెరుగైన దిగుబడి' : 'Better Yields',
      stat: '40%',
      description: language === 'te' ? 'పంట ఉత్పాదకత పెరుగుదల' : 'increase in crop productivity',
    },
    {
      icon: TrendingUp,
      title: language === 'te' ? 'తక్కువ ఖర్చులు' : 'Lower Costs',
      stat: '30%',
      description: language === 'te' ? 'ఇన్‌పుట్ ఖర్చుల తగ్గింపు' : 'reduction in input costs',
    },
    {
      icon: Users,
      title: language === 'te' ? 'రైతుల సేవ' : 'Farmers Served',
      stat: '10K+',
      description: language === 'te' ? 'రైతులకు సహాయం అందించబడింది' : 'farmers helped so far',
    },
  ];

  return (
    <Layout>
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
              <Lightbulb className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                {language === 'te' ? 'ఆధునిక వ్యవసాయం' : 'Modern Farming'}
              </span>
            </div>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              {language === 'te' ? 'AI తో వ్యవసాయాన్ని మార్చడం' : 'Transforming Agriculture with AI'}
            </h1>
            <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
              {language === 'te'
                ? 'మా లక్ష్యం అధునాతన సాంకేతిక పరిజ్ఞానాన్ని రైతుల చేతుల్లో పెట్టడం, వారి నిర్ణయాలను మెరుగుపరచడం మరియు జీవనోపాధిని పెంచడం.'
                : 'Our mission is to put advanced technology in farmers hands, improving their decisions and enhancing livelihoods.'}
            </p>
          </div>

          {/* Mission Section */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="feature-card">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
                    {language === 'te' ? 'మా దృష్టి' : 'Our Vision'}
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    {language === 'te'
                      ? 'ప్రతి రైతుకు AI-ఆధారిత వ్యవసాయ సలహాదారుని అందించడం మా దృష్టి. సాంకేతిక పరిజ్ఞానం ద్వారా మేము రైతులకు మెరుగైన పంట నిర్ణయాలు తీసుకోవడానికి, వారి ఆదాయాన్ని పెంచుకోవడానికి మరియు పర్యావరణ అనుకూల వ్యవసాయ పద్ధతులను అనుసరించడానికి సహాయం చేస్తాము.'
                      : 'We envision a future where every farmer has access to an AI-powered farming advisor. Through technology, we help farmers make better crop decisions, increase their income, and adopt sustainable farming practices.'}
                  </p>
                  <p className="text-muted-foreground">
                    {language === 'te'
                      ? 'మేము యువతను మరియు విద్యావంతులను ఆధునిక వ్యవసాయ సాంకేతికతలను స్వీకరించడానికి ప్రోత్సహిస్తాము, భారతదేశ వ్యవసాయ రంగాన్ని మారుస్తాము.'
                      : 'We encourage youth and educated individuals to embrace modern farming technologies, transforming India agriculture sector.'}
                  </p>
                </div>
                <div className="flex justify-center">
                  <div className="w-48 h-48 rounded-full hero-gradient flex items-center justify-center animate-float">
                    <GraduationCap className="h-24 w-24 text-primary-foreground" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Technologies */}
          <div className="mb-16">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground text-center mb-8">
              {language === 'te' ? 'మా సాంకేతికతలు' : 'Our Technologies'}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {technologies.map((tech, index) => (
                <div
                  key={index}
                  className="feature-card text-center animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <tech.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-heading font-semibold text-lg mb-2 text-foreground">
                    {tech.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{tech.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Impact Stats */}
          <div className="bg-gradient-to-br from-primary/5 via-leaf/5 to-wheat/5 rounded-3xl p-8 md:p-12 border border-border">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground text-center mb-8">
              {language === 'te' ? 'మా ప్రభావం' : 'Our Impact'}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-card flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <benefit.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="font-heading text-4xl font-bold text-primary mb-2">
                    {benefit.stat}
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Youth Section */}
          <div className="mt-16 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-leaf/10 rounded-full mb-4">
              <GraduationCap className="h-4 w-4 text-leaf" />
              <span className="text-sm font-medium text-leaf">
                {language === 'te' ? 'యువతకు పిలుపు' : 'Call to Youth'}
              </span>
            </div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-4">
              {language === 'te' 
                ? 'వ్యవసాయం: భవిష్యత్తు వృత్తి'
                : 'Farming: The Career of Tomorrow'}
            </h2>
            <p className="text-muted-foreground text-lg">
              {language === 'te'
                ? 'AI, ML, మరియు IoT వంటి ఆధునిక సాంకేతికతలతో వ్యవసాయం ఒక హై-టెక్ వృత్తిగా మారింది. విద్యావంతులు మరియు యువత ఈ రంగంలో చేరి భారత వ్యవసాయ విప్లవానికి నాయకత్వం వహించవచ్చు. ఈ యాప్ అలాంటి వారికి సహాయపడే సాధనం.'
                : 'With modern technologies like AI, ML, and IoT, farming has become a high-tech profession. Educated youth can join this field and lead India agricultural revolution. This app is a tool to help such pioneers.'}
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
