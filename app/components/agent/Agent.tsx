import { PipelineBuilder } from '../pipeline/PipelineBuilder';
import { Chat } from './Chat';

export function AgentUI() {
  return (
    <div className="flex flex-1 w-screen h-screen">
      <div className="flex flex-1">
        <Chat />
      </div>
      <div className="flex flex-1">
        <PipelineBuilder className="w-full h-full overflow-auto pt-6 p-3" />
      </div>
    </div>
  );
}
