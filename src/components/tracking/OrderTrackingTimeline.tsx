import { TrackingEntry, getStatusesForFulfillment } from "@/hooks/useOrderTracking";
import { CheckCircle2, Circle } from "lucide-react";

interface Props {
  tracking: TrackingEntry[];
  currentStageIndex: number;
  fulfillmentType?: string;
}

const OrderTrackingTimeline = ({ tracking, currentStageIndex, fulfillmentType = "delivery" }: Props) => {
  const statuses = getStatusesForFulfillment(fulfillmentType);

  const getTrackingEntry = (status: string) =>
    tracking.find((t) => t.status === status);

  return (
    <div className="space-y-0">
      {statuses.map((stage, idx) => {
        const entry = getTrackingEntry(stage.value);
        const isCompleted = idx <= currentStageIndex && tracking.length > 0;
        const isCurrent = idx === currentStageIndex && tracking.length > 0;

        return (
          <div key={stage.value} className="flex gap-4">
            <div className="flex flex-col items-center">
              {isCompleted ? (
                <CheckCircle2
                  className={`w-6 h-6 flex-shrink-0 ${
                    isCurrent ? "text-primary" : "text-primary/60"
                  }`}
                />
              ) : (
                <Circle className="w-6 h-6 flex-shrink-0 text-muted-foreground/30" />
              )}
              {idx < statuses.length - 1 && (
                <div
                  className={`w-0.5 h-10 ${
                    isCompleted ? "bg-primary/40" : "bg-muted-foreground/10"
                  }`}
                />
              )}
            </div>

            <div className="pb-6 -mt-0.5">
              <p
                className={`text-sm font-medium ${
                  isCompleted ? "text-foreground" : "text-muted-foreground/50"
                }`}
              >
                {stage.icon} {stage.label}
              </p>
              {entry && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {new Date(entry.created_at).toLocaleString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              )}
              {entry?.note && (
                <p className="text-xs text-muted-foreground/70 mt-0.5 italic">
                  {entry.note}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderTrackingTimeline;
