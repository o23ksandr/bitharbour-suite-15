import SupportFAB from '@/components/SupportFAB';
import SEO from '@/components/SEO';
import HeaderBar from '@/components/HeaderBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useState, useEffect, useRef } from 'react';
import ChangePhotoModal from '@/components/ChangePhotoModal';
import { Copy, RotateCcw } from 'lucide-react';
import QRCode from 'qrcode';

const user = {
  fullName: 'Alex Morgan',
  accountId: 'BH-482913',
  status: 'Activated',
  address: { street: '123 Harbor St', country: 'US', city: 'Miami', postalCode: '33101' },
};

export default function Settings() {
  const [activeSection, setActiveSection] = useState('general');
  const [isChangePhotoModalOpen, setIsChangePhotoModalOpen] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState<string | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle URL hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'activate' || hash === 'verification') {
        setActiveSection(hash);
      } else {
        setActiveSection('general');
      }
    };

    // Set initial section based on current hash
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);
  const handlePhotoSave = (file: File) => {
    // Handle photo upload logic here
    console.log('Photo selected:', file);
  };
  const cryptoOptions = [{
    name: 'Bitcoin (BTC)',
    key: 'btc',
    address: '34×6gZBQCJqKfNVvDru68EvTZNaRm3FTB2',
    qrCode: '/lovable-uploads/8a1446fd-2282-4554-b19e-bfcaf4965e55.png'
  }, {
    name: 'Ethereum (ETH)',
    key: 'eth',
    address: '0x742d35Cc6635Cb6996D75e7a9E7D4f3B7ac5a123',
    qrCode: '/lovable-uploads/8a1446fd-2282-4554-b19e-bfcaf4965e55.png'
  }, {
    name: 'Tron (TRC20)',
    key: 'tron',
    address: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
    qrCode: '/lovable-uploads/8a1446fd-2282-4554-b19e-bfcaf4965e55.png'
  }];
  const handleCryptoSelect = async (cryptoKey: string) => {
    setSelectedCrypto(cryptoKey);
    const selectedOption = cryptoOptions.find(crypto => crypto.key === cryptoKey);
    if (selectedOption) {
      try {
        const qrCodeUrl = await QRCode.toDataURL(selectedOption.address, {
          width: 192,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        setQrCodeDataUrl(qrCodeUrl);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    }
  };
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };
  const getSelectedCrypto = () => {
    return cryptoOptions.find(crypto => crypto.key === selectedCrypto);
  };
  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('File selected:', file);
      // Handle file upload logic here
    }
  };
  return <>
      <SEO title="Settings | BITHARBOUR" description="Manage your profile and preferences." />
      <HeaderBar />
      <main className="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-6">
        <section className="space-y-6">
          <header>
            <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
            <p className="text-sm text-muted-foreground">Manage your profile and preferences</p>
          </header>

          <div className="flex gap-6">
            {/* Left Sidebar - Hidden on mobile */}
            <div className="hidden md:block w-64">
              
              <nav className="space-y-2">
                <button onClick={() => setActiveSection('general')} className={`w-full text-left px-4 py-2 rounded-md transition-colors ${activeSection === 'general' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>
                  General Settings
                </button>
                <button onClick={() => setActiveSection('activate')} className={`w-full text-left px-4 py-2 rounded-md transition-colors ${activeSection === 'activate' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>
                  Activate Account
                </button>
                <button onClick={() => setActiveSection('verification')} className={`w-full text-left px-4 py-2 rounded-md transition-colors ${activeSection === 'verification' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>
                  Verification
                </button>
              </nav>
            </div>

            {/* Main Content - Full width on mobile */}
            <div className="flex-1 w-full space-y-6">
              {/* Profile Preview */}
              <div className="flex items-start gap-6">
                <Avatar className="w-20 h-20">
                  <AvatarImage src="/lovable-uploads/1b21aba6-9682-4957-9b78-58748abc057a.png" alt={user?.fullName || "User"} />
                  <AvatarFallback>
                    {user?.fullName ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-semibold">{user?.fullName || 'User Name'}</h2>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {user?.status || 'Activated'}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-3">Account ID: {user?.accountId || '284921'}</p>
                  <Button variant="outline" size="sm" onClick={() => setIsChangePhotoModalOpen(true)}>
                    Change Photo
                  </Button>
                </div>
              </div>
              {activeSection === 'general' && <div className="md:bg-card md:border md:rounded-lg md:shadow-sm">
                  <div className="md:p-8 space-y-8 px-0 py-4">
                    {/* General Settings */}
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold">General Settings</h3>

                      {/* Personal Information */}
                      <div className="space-y-4">
                        <h4 className="text-lg font-medium">Personal Information</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <div className="flex items-center gap-2">
                              <Input id="fullName" defaultValue={user?.fullName || ""} className="flex-1" />
                              <Button variant="link" size="sm" className="text-primary p-0">
                                Edit
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="dateOfBirth">Date of Birth</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="--/--/----" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1990-01-01">01/01/1990</SelectItem>
                                <SelectItem value="1985-05-15">15/05/1985</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="billingAddress">Billing Address</Label>
                            <Input id="billingAddress" defaultValue={user?.address?.street || ""} />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="postalCode">Postal Code</Label>
                            <Input id="postalCode" defaultValue={user?.address?.postalCode || ""} />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="country">Country</Label>
                            <Select defaultValue={user?.address?.country?.toLowerCase() || "spain"}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="spain">Spain</SelectItem>
                                <SelectItem value="usa">United States</SelectItem>
                                <SelectItem value="uk">United Kingdom</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Select defaultValue={user?.address?.city?.toLowerCase() || "madrid"}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="madrid">Madrid</SelectItem>
                                <SelectItem value="barcelona">Barcelona</SelectItem>
                                <SelectItem value="valencia">Valencia</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      {/* Platform Preferences */}
                      <div className="space-y-4">
                        <h4 className="text-lg font-medium">Platform Preferences</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="language">Platform Language</Label>
                            <Select defaultValue="english">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="english">English</SelectItem>
                                <SelectItem value="spanish">Spanish</SelectItem>
                                <SelectItem value="french">French</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-3">
                            <Label>Notifications</Label>
                            <div className="flex items-center space-x-2">
                              <Switch id="notifications" />
                              <Label htmlFor="notifications" className="text-sm">
                                Turn on/off push notifications
                              </Label>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <Label>Tools</Label>
                            <div className="flex items-center space-x-2">
                              <Switch id="tools" defaultChecked />
                              <Label htmlFor="tools" className="text-sm">
                                Show tools on the full screen
                              </Label>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Change Password */}
                      <div className="space-y-4">
                        <h4 className="text-lg font-medium">Change Password</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input id="newPassword" type="password" placeholder="Create password" />
                            <p className="text-xs text-muted-foreground">This is a helper text.</p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="repeatPassword">Repeat Password</Label>
                            <Input id="repeatPassword" type="password" placeholder="Repeat password" />
                            <p className="text-xs text-muted-foreground">This is a helper text.</p>
                          </div>
                        </div>
                      </div>

                      {/* Save Button */}
                      <div className="flex justify-end pt-6">
                        <Button className="px-8">
                          Save Settings
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>}

              {activeSection === 'activate' && <div className="space-y-6">
                  <h2 className="text-xl font-semibold">Activate Account</h2>
                  
                  {/* Activation Notice */}
                  <div className="bg-blue-600 text-white p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium">Activation reserve of 0.0027287 BTC ($300) is required</p>
                        <p className="text-sm opacity-90">
                          Activation reserve will be refunded after you have successfully closed the account.
                        </p>
                        <p className="text-sm opacity-90">
                          You can close this account at any time by sending a request to the Support Team
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Generate QR Code Section */}
                  <div className="space-y-4">
                    
                    
                    <div className="flex gap-3">
                      {cryptoOptions.map(crypto => <Button key={crypto.key} variant={selectedCrypto === crypto.key ? "default" : "outline"} onClick={() => handleCryptoSelect(crypto.key)} className="px-4 py-2">
                          {crypto.name}
                        </Button>)}
                    </div>

                    {/* QR Code Display */}
                    {selectedCrypto && getSelectedCrypto() && <div className="border rounded-lg p-6 space-y-4 max-w-md">
                        <div>
                          <h4 className="font-medium text-lg mb-1">
                            Wallet Address ({getSelectedCrypto()!.name.split(' ')[0]})
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Use this QR-code for sending funds to activate your account
                          </p>
                        </div>

                        {/* QR Code */}
                        <div className="flex justify-center p-6">
                          {qrCodeDataUrl ? (
                            <img src={qrCodeDataUrl} alt="Generated QR Code" className="w-48 h-48 object-contain" />
                          ) : (
                            <div className="w-48 h-48 flex items-center justify-center border-2 border-dashed border-muted-foreground/50 rounded">
                              <span className="text-muted-foreground text-sm">Loading QR Code...</span>
                            </div>
                          )}
                        </div>

                        {/* Wallet Address */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">
                            Wallet Address ({getSelectedCrypto()!.name.split(' ')[0]})
                          </Label>
                          <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                            <span className="flex-1 text-sm font-mono break-all">
                              {getSelectedCrypto()!.address}
                            </span>
                            <Button variant="ghost" size="icon" onClick={() => copyToClipboard(getSelectedCrypto()!.address)} className="h-8 w-8 flex-shrink-0">
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Select Another Method Button */}
                        
                      </div>}
                  </div>
                </div>}

              {activeSection === 'verification' && <div className="md:bg-card md:border md:rounded-lg md:shadow-sm">
                  <div className="md:p-8 space-y-6 px-0 py-4">
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-semibold">Confirm Your Identity</h2>
                        <p className="text-muted-foreground">Please provide a clear photo of a valid document.</p>
                      </div>

                      {/* Document Type Selection */}
                      <div className="space-y-2">
                        <Label htmlFor="documentType">Select Document Type</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="E.g. Passport" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="passport">Passport</SelectItem>
                            <SelectItem value="id-card">ID Card</SelectItem>
                            <SelectItem value="drivers-license">Driver's License</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Uploaded Files Display */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm font-medium">document_file_name.jpg</p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>347kb</span>
                                <span>•</span>
                                <span className="text-blue-600">Loading</span>
                              </div>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </Button>
                        </div>
                      </div>

                      {/* File Upload Area */}
                      <div 
                        className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center space-y-4 cursor-pointer hover:border-blue-300 transition-colors relative"
                        onClick={handleFileUploadClick}
                      >
                        <div className="w-12 h-12 mx-auto bg-blue-50 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                        </div>
                        <div className="space-y-2">
                          <p className="text-blue-600 font-medium">Click to upload</p>
                          <p className="text-muted-foreground">or drag and drop</p>
                          <p className="text-sm text-muted-foreground">PNG or JPG (max. 3MB)</p>
                        </div>
                        <input 
                          ref={fileInputRef}
                          type="file" 
                          accept="image/png,image/jpeg" 
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </div>

                      {/* Send Request Button */}
                      <div className="flex justify-end">
                        <Button className="px-8">
                          Send Request
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>}
            </div>
          </div>
        </section>
      </main>
      
      <SupportFAB />
      <ChangePhotoModal isOpen={isChangePhotoModalOpen} onClose={() => setIsChangePhotoModalOpen(false)} onSave={handlePhotoSave} />
    </>;
}