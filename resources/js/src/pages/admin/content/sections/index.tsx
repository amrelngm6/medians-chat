import AboutEditor from './AboutEditor';
import IntroEditor from './IntroEditor';
import ClientsEditor from './ClientsEditor';
import ContactEditor from './ContactEditor';
import GenericFlowEditor from './GenericFlowEditor';
import SkillsEditor from './SkillsEditor';
import ProjectsEditor from './ProjectsEditor';
import ServicesEditor from './ServicesEditor';
    

export const sectionComponents = {
  intro: IntroEditor,
  about: AboutEditor,
  clients: ClientsEditor,
  contact: ContactEditor,
  projects: ProjectsEditor,
  services: ServicesEditor,
  skills: SkillsEditor,
  generic: GenericFlowEditor,
} as const;

export type SectionName = keyof typeof sectionComponents;