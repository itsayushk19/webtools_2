// app/(root)/activity/add/[type]/page.tsx
import Header from "@/components/shared/Header"
import { ActivityTypes, ActivityTypeKey } from "@/constants/index"
import ActivityForm from "@/components/shared/ActivityForm"

interface PageProps {
  params: Promise<{ type: string }>
}

// page.tsx
const ActivityPage = async ({ params }: PageProps) => {
  // Await params since in Next.js 16 App Router it's a Promise
  const resolvedParams = await params;

  const activity = resolvedParams.activity as ActivityTypeKey; // tool slug
  const activityData = ActivityTypes[activity];               // fetch full tool data
;
  if (!activityData) {
    return <div>Activity not found</div>;
  }

  return (
    <>
      <Header
        title={activityData.title}
        subtitle={activityData.subTitle}
      />
      <ActivityForm activityKey={activity}/>
    </>
  );
};

export default ActivityPage;
