import { Redirect } from "~/components/layout/Redirect";
import { paths } from "~/router";

export default function Home() {
  return <Redirect href={paths.torrents()} />;
}
