"use client";

import { Settings } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { useSidebar } from "./ui/sidebar";

type SettingsDialogProps = {
  voice: string;
  setVoice: (voice: string) => void;
};

export const SUPPORTED_VOICES = ["algenib", "umbriel", "sirius", "achernar"];

export function SettingsDialog({ voice, setVoice }: SettingsDialogProps) {
  const { state } = useSidebar();

  const handleVoiceChange = (newVoice: string) => {
    setVoice(newVoice);
    localStorage.setItem("Sweety-voice", newVoice);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-center group-data-[collapsible=icon]:justify-start group-data-[collapsible=icon]:gap-2 group-data-[collapsible=icon]:p-2"
        >
          <Settings className="shrink-0" />
          <span
            className={
              "truncate group-data-[collapsible=icon]:hidden"
            }
          >
            Settings
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Customize the assistant&apos;s settings.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="voice">Assistant Voice (Disabled)</Label>
            <Select value={voice} onValueChange={handleVoiceChange} disabled>
              <SelectTrigger id="voice" className="w-full">
                <SelectValue placeholder="Select a voice" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="algenib">Algenib (Cute &amp; Lovely)</SelectItem>
                <SelectItem value="umbriel">Umbriel (Calm &amp; Friendly)</SelectItem>
                <SelectItem value="sirius">Sirius (Professional)</SelectItem>
                <SelectItem value="achernar">Achernar (Calm &amp; Friendly)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
