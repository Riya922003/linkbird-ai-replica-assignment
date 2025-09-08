import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Save } from "lucide-react";

interface MessageCardProps {
  title: string;
  subtitle?: string;
  messageContent?: string;
  defaultDay?: string;
  afterMessage?: string;
  onPreview?: () => void;
  onSave?: () => void;
  onSendToggle?: (checked: boolean) => void;
  onDayChange?: (value: string) => void;
  onMessageChange?: (value: string) => void;
  isSendEnabled?: boolean;
}

export function MessageCard({
  title,
  subtitle,
  messageContent = "",
  defaultDay = "1 day",
  afterMessage = "After Welcome Message",
  onPreview,
  onSave,
  onSendToggle,
  onDayChange,
  onMessageChange,
  isSendEnabled = false,
}: MessageCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onPreview}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            Preview
          </Button>
          <Button 
            size="sm"
            onClick={onSave}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {subtitle && (
          <p className="text-sm text-gray-600">{subtitle}</p>
        )}
        
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Message Content
          </label>
          <textarea
            className="w-full min-h-32 max-h-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
            placeholder="Enter your message content..."
            value={messageContent}
            onChange={(e) => onMessageChange?.(e.target.value)}
          />
        </div>
      </CardContent>

      <CardFooter className="flex items-center gap-4 pt-4">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="send-message"
            checked={isSendEnabled}
            onCheckedChange={(checked) => onSendToggle?.(checked as boolean)}
          />
          <label 
            htmlFor="send-message" 
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Send
          </label>
        </div>

        <Select defaultValue={defaultDay} onValueChange={onDayChange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1 day">1 day</SelectItem>
            <SelectItem value="2 days">2 days</SelectItem>
            <SelectItem value="3 days">3 days</SelectItem>
            <SelectItem value="1 week">1 week</SelectItem>
            <SelectItem value="2 weeks">2 weeks</SelectItem>
            <SelectItem value="1 month">1 month</SelectItem>
          </SelectContent>
        </Select>

        <span className="text-sm text-gray-600">{afterMessage}</span>
      </CardFooter>
    </Card>
  );
}
