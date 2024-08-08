'use client';

import AddProject from './components/AddProject';
import AddStep from './components/AddStep';
import AddTestDoc from './components/AddTestDoc';
import { useStore } from './store/store';

export default function Home() {
  const projectName = useStore((state) => state.projectName);
  const testDocs = useStore((state) => state.testDocs);

  return (
    <main className="flex min-h-screen">
      <div className="flex items-center justify-center w-full h-full min-h-screen">
        {!Boolean(projectName?.length) && <AddProject />}
        {Boolean(projectName?.length) && !Boolean(testDocs?.length) && (
          <div className="flex flex-col gap-2">
            <div>Working on {projectName}</div>
            <AddTestDoc />
          </div>
        )}
        {Boolean(testDocs?.length) && (
          <div className="flex flex-col gap-2">
            <div>Working on {projectName}</div>
            <div>
              Docs:{' '}
              {testDocs.map((d) => (
                <div key={d.id}>{d.name}</div>
              ))}
            </div>
            <div>
              <AddStep />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
