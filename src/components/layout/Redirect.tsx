import { onSettled } from "solid-js";
import { useNavigate } from "@solidjs/router";

/** Declarative client-side redirect used by index routes. */
export function Redirect(props: { href: string }) {
  const navigate = useNavigate();
  onSettled(() => {
    navigate(props.href, { replace: true });
  });
  return null;
}
