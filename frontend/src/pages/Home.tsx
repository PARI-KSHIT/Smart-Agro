import { Link } from 'react-router-dom';
import { 
  Camera, 
  Sprout, 
  LayoutDashboard, 
  CloudSun, 
  TrendingUp, 
  Languages,
  CheckCircle2,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import farmerImage from '../assets/farmer.jpg';
import Footer from '../components/Footer';

export default function Home() {
  const { t } = useTranslation();

  const features = [
    {
      icon: <Camera className="w-10 h-10" />,
      title: t('home.features.detect.title'),
      desc: t('home.features.detect.desc'),
      color: "bg-blue-50 text-blue-600",
      link: "/detect"
    },
    {
      icon: <Sprout className="w-10 h-10" />,
      title: t('home.features.fertilizer.title'),
      desc: t('home.features.fertilizer.desc'),
      color: "bg-green-50 text-green-600",
      link: "/fertilizers"
    },
    {
      icon: <CloudSun className="w-10 h-10" />,
      title: t('home.features.weather.title'),
      desc: t('home.features.weather.desc'),
      color: "bg-orange-50 text-orange-600",
      link: "/weather"
    },
    {
      icon: <TrendingUp className="w-10 h-10" />,
      title: t('home.features.market.title'),
      desc: t('home.features.market.desc'),
      color: "bg-purple-50 text-purple-600",
      link: "/market"
    },
    {
      icon: <Languages className="w-10 h-10" />,
      title: t('home.features.multi.title'),
      desc: t('home.features.multi.desc'),
      color: "bg-pink-50 text-pink-600",
      link: "#"
    },
    {
      icon: <LayoutDashboard className="w-10 h-10" />,
      title: t('home.features.dashboard.title'),
      desc: t('home.features.dashboard.desc'),
      color: "bg-emerald-50 text-emerald-600",
      link: "/dashboard"
    }
  ];

  const benefits = [
    t('home.benefits.cropLoss'),
    t('home.benefits.rightFertilizer'),
    t('home.benefits.savesTime'),
    t('home.benefits.easyToUse')
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero Section */}
      <div className="bg-emerald-800 text-white py-24 px-4 sm:px-6 lg:px-8 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-center lg:text-left"
            >
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
                {t('home.title')}
              </h1>
              <p className="text-xl md:text-2xl text-emerald-100 mb-10 font-medium">
                {t('home.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                <Link 
                  to="/detect" 
                  className="bg-white text-emerald-800 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-50 transition-all shadow-xl hover:shadow-white/20 active:scale-95 text-center flex items-center justify-center gap-2"
                >
                  {t('home.getStarted')}
                  <ChevronRight className="w-5 h-5" />
                </Link>
                <Link 
                  to="/fertilizers" 
                  className="bg-emerald-700/50 backdrop-blur-md text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all border border-emerald-500/30 text-center active:scale-95"
                >
                  {t('home.learnMore')}
                </Link>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="absolute inset-0 bg-emerald-400 rounded-full blur-[120px] opacity-20 animate-pulse"></div>
              <img 
                src={farmerImage}
                alt="Farmer"
                className="relative z-10 w-full max-w-md mx-auto rounded-[32px] shadow-2xl object-cover aspect-[3/4] border-4 border-white/10"
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t('home.featuresTitle')}</h2>
            <div className="w-20 h-1.5 bg-emerald-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className="p-8 rounded-[32px] border border-gray-100 bg-white shadow-sm hover:shadow-xl hover:border-emerald-100 transition-all group"
              >
                <div className={`${feature.color} w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed mb-6">
                  {feature.desc}
                </p>
                <Link 
                  to={feature.link}
                  className="text-emerald-600 font-bold flex items-center gap-2 hover:gap-3 transition-all"
                >
                  {t('dashboard.learnMore')}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-24 bg-emerald-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-[48px] overflow-hidden shadow-xl flex flex-col lg:flex-row border border-emerald-100">
            <div className="lg:w-1/2 p-12 lg:p-20 bg-emerald-600 text-white flex flex-col justify-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('home.benefitsTitle')}</h2>
              <p className="text-emerald-100 mb-10 text-lg">
                Discover how Smart Agro helps farmers achieve higher yields and better results with advanced AI technology.
              </p>
              <div className="grid gap-4">
                {benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-md">
                    <CheckCircle2 className="w-6 h-6 text-emerald-300 flex-shrink-0" />
                    <span className="font-bold text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2 relative bg-gray-100 min-h-[400px]">
              <img 
                src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=1000"
                alt="Farm Benefits"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
