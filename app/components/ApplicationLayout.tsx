import {
  ArrowRightStartOnRectangleIcon,
  ClipboardIcon,
  LightBulbIcon,
  QuestionMarkCircleIcon,
  ShieldCheckIcon,
  UserCircleIcon,
} from '@heroicons/react/16/solid';
import { useStore } from '../store/store';
import AddTestDoc from './AddTestDoc';
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
  const state = useStore((s) => s);

  return (
    <SidebarLayout
      navbar={
        <Navbar>
          <NavbarSpacer />
          <NavbarSection>Cogniloom</NavbarSection>
        </Navbar>
      }
      sidebar={
        <Sidebar>
          <SidebarHeader>
            <SidebarLabel>Cogniloom</SidebarLabel>
          </SidebarHeader>

          <SidebarBody>
            <SidebarSection>
              <SidebarItem>
                <ClipboardIcon />
                <SidebarLabel>{state.projectName}</SidebarLabel>
              </SidebarItem>
            </SidebarSection>

            <SidebarSection className="max-lg:hidden">
              <SidebarHeading>Documents</SidebarHeading>
              {state.testDocs.map((doc) => (
                <SidebarItem key={doc.id}>{doc.name}</SidebarItem>
              ))}
              <AddTestDoc />
            </SidebarSection>
          </SidebarBody>

          <SidebarFooter className="max-lg:hidden">
            {!Boolean(state.pipelinePlan?.length) && <PlanPipeline />}
            <SidebarItem onClick={showAssist}>
              <QuestionMarkCircleIcon />
              <SidebarLabel>Show assist</SidebarLabel>
            </SidebarItem>
          </SidebarFooter>
        </Sidebar>
      }
    >
      {children}
    </SidebarLayout>
  );
}
