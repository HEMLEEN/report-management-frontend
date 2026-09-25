import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Check, ChevronRight, Contact, Home, Landmark } from 'lucide-react';
import api from '../services/api';
import { PointOfContact, Project, Source, PropertyType } from '../types';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setPointOfContact, setProject, setPropertyType, setSource } from '../store/workflowSlice';

const projectIcons = { Forsite: Building2, Modhaus: Landmark, Fanzart: Building2 };

export default function Onboarding() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const workflow = useAppSelector((s) => s.workflow);
  const [sources, setSources] = useState<Source[]>([]);
  const [contacts, setContacts] = useState<PointOfContact[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(false);

  useEffect(() => {
    api.get<Source[]>('/sources').then((r) => setSources(r.data));
    api.get<Project[]>('/projects').then((r) => setProjects(r.data));
  }, []);

  async function sourceChanged(id: string) {
    const source = sources.find((x) => x.id === id);
    if (!source) return;
    dispatch(setSource(source));
    setLoadingContacts(true);
    try {
      const { data } = await api.get<PointOfContact[]>(`/sources/${id}/points-of-contact`);
      setContacts(data);
    } finally {
      setLoadingContacts(false);
    }
  }

  function contactChanged(id: string) {
    const contact = contacts.find((x) => x.id === id);
    if (contact) dispatch(setPointOfContact(contact));
  }

  function projectChanged(project: Project) {
    dispatch(setProject(project));
  }

  function typeChanged(type: PropertyType) {
    dispatch(setPropertyType(type));
    navigate('/');
  }

  const step = !workflow.source ? 1 : !workflow.pointOfContact ? 2 : !workflow.project ? 3 : 4;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-600 font-bold text-white">RM</div>
              <div><h1 className="text-xl font-bold">Report Management</h1><p className="text-xs text-slate-500">Workspace setup</p></div>
            </div>
          </div>
          <div className="rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-sm">Step {step} of 4</div>
        </div>

        <div className="card p-5 sm:p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold">Configure your workspace</h2>
            <p className="mt-1 text-sm text-slate-500">Complete each selection to open the main management screen.</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold">Source of Contact</label>
              <select className="input" value={workflow.source?.id ?? ''} onChange={(e) => sourceChanged(e.target.value)}>
                <option value="">Select source</option>
                {sources.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Point of Contact</label>
              <select className="input disabled:bg-slate-100" disabled={!workflow.source || loadingContacts} value={workflow.pointOfContact?.id ?? ''} onChange={(e) => contactChanged(e.target.value)}>
                <option value="">{loadingContacts ? 'Loading...' : 'Select point of contact'}</option>
                {contacts.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          {workflow.pointOfContact && (
            <div className="mt-10">
              <div className="mb-4 flex items-center gap-2"><Contact size={18} className="text-brand-600" /><h3 className="font-bold">Select Project</h3></div>
              <div className="grid gap-4 md:grid-cols-3">
                {projects.map((project) => {
                  const Icon = projectIcons[project.name];
                  const selected = workflow.project?.id === project.id;
                  return (
                    <button key={project.id} onClick={() => projectChanged(project)} className={`rounded-2xl border p-5 text-left transition hover:-translate-y-0.5 hover:shadow-md ${selected ? 'border-brand-600 bg-brand-50 ring-2 ring-brand-100' : 'border-slate-200 bg-white'}`}>
                      <div className="mb-5 flex items-center justify-between">
                        <div className="grid h-12 w-12 place-items-center rounded-xl bg-slate-100 text-slate-700"><Icon size={24} /></div>
                        {selected && <div className="grid h-7 w-7 place-items-center rounded-full bg-brand-600 text-white"><Check size={16} /></div>}
                      </div>
                      <h4 className="text-lg font-bold">{project.name}</h4>
                      <p className="mt-1 text-sm text-slate-500">{project.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {workflow.project && (
            <div className="mt-10">
              <h3 className="mb-4 font-bold">Property Type</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {(['Residential', 'Commercial'] as PropertyType[]).map((type) => {
                  const selected = workflow.propertyType === type;
                  return (
                    <button key={type} onClick={() => typeChanged(type)} className={`flex items-center justify-between rounded-2xl border p-5 text-left transition ${selected ? 'border-brand-600 bg-brand-50' : 'border-slate-200 bg-white hover:border-brand-300'}`}>
                      <div className="flex items-center gap-4">
                        <div className="grid h-12 w-12 place-items-center rounded-xl bg-slate-100"><Home size={22} /></div>
                        <div><p className="font-bold">{type}</p><p className="text-sm text-slate-500">{type} property workflow</p></div>
                      </div>
                      <ChevronRight size={20} className="text-slate-400" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}