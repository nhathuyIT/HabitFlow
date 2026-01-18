import { Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface PerfectDayBannerProps {
  show: boolean;
}

export function PerfectDayBanner({ show }: PerfectDayBannerProps) {
  if (!show) return null;

  return (
    <section>
      <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
        <CardContent className="p-6 text-center">
          <div className="flex justify-center mb-3">
            <div className="size-14 rounded-2xl bg-primary/20 flex items-center justify-center animate-pulse">
              <Award className="size-7 text-primary" />
            </div>
          </div>
          <h4 className="font-bold text-lg">🎉 Perfect Day!</h4>
          <p className="text-muted-foreground">
            You've completed all your habits today. Keep up the amazing work!
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
