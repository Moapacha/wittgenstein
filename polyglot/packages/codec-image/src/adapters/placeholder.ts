export interface AdapterLoaderSpec {
  name: string;
  checkpointUri: string;
  notes: string;
}

export function loadPlaceholderAdapter(): AdapterLoaderSpec {
  return {
    name: "placeholder-adapter",
    checkpointUri: "weights://todo",
    notes: "Reserved for a small scene-to-latent adapter trained after scaffold phase.",
  };
}
