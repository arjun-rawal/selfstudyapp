import "@/styles/globals.css";
import { Provider } from "@/components/ui/provider";
import { Analytics } from "@vercel/analytics/react"
export default function App({ Component, pageProps }) {
  return (
    <Provider>
      <Component {...pageProps} />
    </Provider>
  );
}
