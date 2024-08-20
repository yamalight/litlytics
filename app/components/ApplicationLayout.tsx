import {
  ArrowRightStartOnRectangleIcon,
  ClipboardIcon,
  LightBulbIcon,
  QuestionMarkCircleIcon,
  ShieldCheckIcon,
  UserCircleIcon,
} from '@heroicons/react/16/solid';
import { useAtom } from 'jotai';
import { pipelineAtom } from '../store/store';
import {
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from './catalyst/dropdown';
import { Navbar, NavbarSection, NavbarSpacer } from './catalyst/navbar';
import {
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarHeading,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
} from './catalyst/sidebar';
import { SidebarLayout } from './catalyst/sidebar-layout';
import AddTestDoc from './docs/AddTestDoc';
import { DocItem } from './docs/DocItem';
import PlanPipeline from './pipeline/PlanPipeline';

function AccountDropdownMenu({
  anchor,
}: {
  anchor: 'top start' | 'bottom end';
}) {
  return (
    <DropdownMenu className="min-w-64" anchor={anchor}>
      <DropdownItem href="#">
        <UserCircleIcon />
        <DropdownLabel>My account</DropdownLabel>
      </DropdownItem>
      <DropdownDivider />
      <DropdownItem href="#">
        <ShieldCheckIcon />
        <DropdownLabel>Privacy policy</DropdownLabel>
      </DropdownItem>
      <DropdownItem href="#">
        <LightBulbIcon />
        <DropdownLabel>Share feedback</DropdownLabel>
      </DropdownItem>
      <DropdownDivider />
      <DropdownItem href="#">
        <ArrowRightStartOnRectangleIcon />
        <DropdownLabel>Sign out</DropdownLabel>
      </DropdownItem>
    </DropdownMenu>
  );
}

export function ApplicationLayout({
  children,
  showAssist,
}: {
  children: React.ReactNode;
  showAssist: () => void;
}) {
  const [pipeline, setPipeline] = useAtom(pipelineAtom);

  return (
    <SidebarLayout
      navbar={
        <Navbar>
          <NavbarSpacer />
          <NavbarSection>Convolitics</NavbarSection>
        </Navbar>
      }
      sidebar={
        <Sidebar>
          <SidebarHeader>
            <SidebarLabel>Convolitics</SidebarLabel>
          </SidebarHeader>

          <SidebarBody>
            <SidebarSection>
              <SidebarItem>
                <ClipboardIcon />
                <SidebarLabel>{pipeline.name}</SidebarLabel>
              </SidebarItem>
            </SidebarSection>

            <SidebarSection className="max-lg:hidden">
              <SidebarHeading>Documents</SidebarHeading>
              {pipeline.documents.map((doc) => (
                <DocItem doc={doc} key={doc.id} />
              ))}
              <AddTestDoc />
            </SidebarSection>
          </SidebarBody>

          <SidebarFooter className="max-lg:hidden">
            {!Boolean(pipeline.pipelinePlan?.length) && <PlanPipeline />}
            {Boolean(pipeline.pipelinePlan?.length) && (
              <SidebarItem onClick={showAssist}>
                <QuestionMarkCircleIcon />
                <SidebarLabel>Show assist</SidebarLabel>
              </SidebarItem>
            )}
          </SidebarFooter>
        </Sidebar>
      }
    >
      {children}
    </SidebarLayout>
  );
}
