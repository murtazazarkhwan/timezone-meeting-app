import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { timezones, getTimezoneDisplayName } from "@/lib/timezone";

interface TimezoneSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function TimezoneSelector({ value, onValueChange }: TimezoneSelectorProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select your timezone" />
      </SelectTrigger>
      <SelectContent>
        {timezones.map((timezone) => (
          <SelectItem key={timezone} value={timezone}>
            {getTimezoneDisplayName(timezone)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}