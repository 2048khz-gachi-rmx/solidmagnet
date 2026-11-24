import { Redirect } from "~/components/layout/Redirect";
import { paths } from "~/router";

export default function QueuesIndex() {
  return <Redirect href={paths.dashboard.queues.visualize()} />;
}
