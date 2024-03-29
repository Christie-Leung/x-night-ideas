import { format, parseISO } from "date-fns";
import { createClient } from "@/utils/supabase/client";
import { auth } from "@clerk/nextjs";
import { EventClient } from "./components/client";
import { EventColumn } from "./components/column";
import { Separator } from "@/components/ui/separator";
import { RequestClient } from "./request/components/client";
import { RequestGroupColumn } from "./request/components/column";
import toast from "react-hot-toast";

const EventsPage = async ({ params }: {
    params: { groupId: string }
}) => {
  const supabase = createClient();
  const { userId } = auth();


  const { data: events, error } = await supabase.from('Event')
  .select("*")
  .eq("groupId", params.groupId);

  if (error) {
    toast.error("An error occurred while trying to fetch event data.");
  }

  let formattedEvents: EventColumn[] = []
  
  if (events) {
    formattedEvents = events.map((item) => ({
      uuid: item.uuid,
      name: item.name,
      description: item.description,
      groupId: params.groupId,
      eventDate: format(parseISO(events[0].event_date), "MMMM do, yyyy"),
      location: item.location,
    }));
  }

  const { data: group, error: groupError } = await supabase.from('RequestGroup')
  .select("*")
  .eq("groupId", params.groupId);

  let formattedGroups: RequestGroupColumn[] = []
  
  if (group) {
    formattedGroups = group.map((item) => ({
      id: item.id,
      groupId: item.groupId,
      name: item.name,
      type: item.type,
      createdAt: format(parseISO(item.created_at), "MMMM do, yyyy"),
    }));
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <EventClient data={formattedEvents} />
        <Separator />
        <RequestClient data={formattedGroups} />
      </div>
    </div>
  )
}

export default EventsPage;