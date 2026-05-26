import React, { useState, useEffect } from 'react';
import { User, MapPin, Phone, Ruler, Droplets, Loader2, Save, Leaf } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface FarmerProfile {
  full_name: string | null;
  phone: string | null;
  village: string | null;
  district: string | null;
  state: string | null;
  land_area_acres: number | null;
  soil_type: string | null;
  irrigation_type: string | null;
  primary_crops: string[] | null;
  latitude: number | null;
  longitude: number | null;
}

const soilTypes = [
  { id: 'alluvial', name: 'Alluvial', nameTE: 'ఒండ్రు' },
  { id: 'black', name: 'Black', nameTE: 'నల్ల' },
  { id: 'red', name: 'Red', nameTE: 'ఎర్ర' },
  { id: 'laterite', name: 'Laterite', nameTE: 'లేటరైట్' },
  { id: 'sandy', name: 'Sandy', nameTE: 'ఇసుక' },
];

const irrigationTypes = [
  { id: 'canal', name: 'Canal', nameTE: 'కాలువ' },
  { id: 'borewell', name: 'Borewell', nameTE: 'బోర్వెల్' },
  { id: 'rainfed', name: 'Rainfed', nameTE: 'వర్షాధారం' },
  { id: 'drip', name: 'Drip', nameTE: 'డ్రిప్' },
  { id: 'sprinkler', name: 'Sprinkler', nameTE: 'స్ప్రింక్లర్' },
];

const Profile: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState<FarmerProfile>({
    full_name: '',
    phone: '',
    village: '',
    district: '',
    state: 'Telangana',
    land_area_acres: null,
    soil_type: '',
    irrigation_type: '',
    primary_crops: [],
    latitude: null,
    longitude: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('farmer_profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (error) throw error;
        
        if (data) {
          setProfile({
            full_name: data.full_name,
            phone: data.phone,
            village: data.village,
            district: data.district,
            state: data.state,
            land_area_acres: data.land_area_acres,
            soil_type: data.soil_type,
            irrigation_type: data.irrigation_type,
            primary_crops: data.primary_crops,
            latitude: data.latitude,
            longitude: data.longitude,
          });
        }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleGetLocation = () => {
    setIsGettingLocation(true);
    
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setProfile((prev) => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
          setIsGettingLocation(false);
          toast({
            title: language === 'te' ? 'స్థానం లభించింది' : 'Location Found',
            description: language === 'te' ? 'మీ స్థానం విజయవంతంగా నమోదు చేయబడింది' : 'Your location has been recorded successfully',
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
          setIsGettingLocation(false);
          toast({
            title: language === 'te' ? 'లోపం' : 'Error',
            description: language === 'te' ? 'స్థానం పొందడం విఫలమైంది' : 'Failed to get location',
            variant: 'destructive',
          });
        }
      );
    } else {
      setIsGettingLocation(false);
      toast({
        title: language === 'te' ? 'మద్దతు లేదు' : 'Not Supported',
        description: language === 'te' ? 'మీ బ్రౌజర్ లొకేషన్‌కు మద్దతు ఇవ్వదు' : 'Your browser does not support geolocation',
        variant: 'destructive',
      });
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    setIsSaving(true);
    
    try {
      const { error } = await supabase
        .from('farmer_profiles')
        .update({
          full_name: profile.full_name,
          phone: profile.phone,
          village: profile.village,
          district: profile.district,
          state: profile.state,
          land_area_acres: profile.land_area_acres,
          soil_type: profile.soil_type,
          irrigation_type: profile.irrigation_type,
          primary_crops: profile.primary_crops,
          latitude: profile.latitude,
          longitude: profile.longitude,
        })
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      toast({
        title: language === 'te' ? 'సేవ్ చేయబడింది' : 'Saved',
        description: language === 'te' ? 'ప్రొఫైల్ విజయవంతంగా అప్‌డేట్ చేయబడింది' : 'Profile updated successfully',
      });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast({
        title: language === 'te' ? 'లోపం' : 'Error',
        description: error.message || 'Failed to save profile',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <Layout>
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
              <User className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                {language === 'te' ? 'రైతు ప్రొఫైల్' : 'Farmer Profile'}
              </span>
            </div>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              {language === 'te' ? 'మీ పొలం వివరాలు' : 'Your Farm Details'}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {language === 'te'
                ? 'వ్యక్తిగతీకరించిన సిఫార్సుల కోసం మీ పొలం వివరాలను నమోదు చేయండి'
                : 'Enter your farm details to get personalized recommendations'}
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="feature-card space-y-6">
              {/* Personal Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    {language === 'te' ? 'పూర్తి పేరు' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    value={profile.full_name || ''}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    {language === 'te' ? 'ఫోన్ నంబర్' : 'Phone Number'}
                  </label>
                  <input
                    type="tel"
                    value={profile.phone || ''}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    {language === 'te' ? 'గ్రామం' : 'Village'}
                  </label>
                  <input
                    type="text"
                    value={profile.village || ''}
                    onChange={(e) => setProfile({ ...profile, village: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    {language === 'te' ? 'జిల్లా' : 'District'}
                  </label>
                  <input
                    type="text"
                    value={profile.district || ''}
                    onChange={(e) => setProfile({ ...profile, district: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    {language === 'te' ? 'రాష్ట్రం' : 'State'}
                  </label>
                  <input
                    type="text"
                    value={profile.state || ''}
                    onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              {/* GPS Location */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {language === 'te' ? 'GPS స్థానం' : 'GPS Location'}
                </label>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    onClick={handleGetLocation}
                    disabled={isGettingLocation}
                  >
                    {isGettingLocation ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <MapPin className="h-4 w-4" />
                    )}
                    {language === 'te' ? 'స్థానం పొందండి' : 'Get Location'}
                  </Button>
                  {profile.latitude && profile.longitude && (
                    <span className="text-sm text-muted-foreground">
                      {profile.latitude.toFixed(4)}, {profile.longitude.toFixed(4)}
                    </span>
                  )}
                </div>
              </div>

              {/* Farm Details */}
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    {language === 'te' ? 'భూమి విస్తీర్ణం (ఎకరాలు)' : 'Land Area (Acres)'}
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={profile.land_area_acres || ''}
                    onChange={(e) => setProfile({ ...profile, land_area_acres: parseFloat(e.target.value) || null })}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    {language === 'te' ? 'నేల రకం' : 'Soil Type'}
                  </label>
                  <select
                    value={profile.soil_type || ''}
                    onChange={(e) => setProfile({ ...profile, soil_type: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="">{language === 'te' ? 'ఎంచుకోండి' : 'Select'}</option>
                    {soilTypes.map((soil) => (
                      <option key={soil.id} value={soil.id}>
                        {language === 'te' ? soil.nameTE : soil.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    {language === 'te' ? 'నీటిపారుదల రకం' : 'Irrigation Type'}
                  </label>
                  <select
                    value={profile.irrigation_type || ''}
                    onChange={(e) => setProfile({ ...profile, irrigation_type: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="">{language === 'te' ? 'ఎంచుకోండి' : 'Select'}</option>
                    {irrigationTypes.map((irr) => (
                      <option key={irr.id} value={irr.id}>
                        {language === 'te' ? irr.nameTE : irr.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-4">
                <Button variant="hero" size="lg" onClick={handleSave} disabled={isSaving}>
                  {isSaving ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Save className="h-5 w-5" />
                  )}
                  {language === 'te' ? 'ప్రొఫైల్ సేవ్ చేయండి' : 'Save Profile'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
