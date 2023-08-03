import React from "react";
import { WhatsNewPage } from "../components/pages/WhatsNewPage";

export const config = {
  unstable_runtimeJS: false,
};

export default function NextAllSongsPage() {
  return <WhatsNewPage />;
}
