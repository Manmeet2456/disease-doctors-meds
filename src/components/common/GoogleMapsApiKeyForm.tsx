
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { setGoogleMapsApiKey, getGoogleMapsApiKey } from '@/utils/googleMapsHelper';
import { toast } from '@/components/ui/use-toast';
import { DialogHeader, Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Key } from 'lucide-react';

const GoogleMapsApiKeyForm = () => {
  const [apiKey, setApiKey] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    // Get saved API key if available
    const savedKey = getGoogleMapsApiKey();
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);
  
  const handleSave = () => {
    if (apiKey.trim()) {
      setGoogleMapsApiKey(apiKey.trim());
      toast({
        title: "Google Maps API key saved",
        description: "Your API key has been saved for this session.",
      });
      setIsOpen(false);
    } else {
      toast({
        title: "Invalid API key",
        description: "Please enter a valid Google Maps API key.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Key className="h-4 w-4" /> Set Google Maps API Key
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Google Maps API Key</DialogTitle>
          <DialogDescription>
            Enter your Google Maps API key to enable location features.
            The key will be stored in your browser for this session only.
          </DialogDescription>
        </DialogHeader>
        <div className="my-4">
          <Input
            placeholder="Enter your Google Maps API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Save API Key</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GoogleMapsApiKeyForm;
