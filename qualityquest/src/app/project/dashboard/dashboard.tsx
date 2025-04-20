"use client";
// dashboard.tsx
import { useEffect, useState } from 'react';
import { Plus, Bug, FileText, ListTodo, Users } from 'lucide-react';
import styles from './dashboard.module.css';
import Button from '@/src/components/ui/button';
import { useRouter } from 'next/navigation';
import Tabs from '@/src/components/ui/Tabs/tabs';
import TabsContent from '@/src/components/ui/Tabs/tabsContent';
import TabsList from '@/src/components/ui/Tabs/tabsList';
import TabsTrigger from '@/src/components/ui/Tabs/tabsTrigger';
import Card from '@/src/components/ui/card';
import CardContent from '@/src/components/ui/cardContent';
import CardHeader from '@/src/components/ui/cardHeader';
import CardTitle from '@/src/components/ui/cardTitle';
import { useSession } from 'next-auth/react';

// Simulated user (In actual app, this should come from auth context or API)
const currentUser = {
  id: 'u123',
  name: 'Jane Doe',
  role: 'product manager', // Change to 'developer' or 'tester' to test other behavior
};

const dummyProjects = [
  {
    id: '1',
    name: 'Project Alpha',
    environments: ['Development', 'Staging', 'Production'],
    tasks: [
      {
        id: 't1',
        name: 'Login Feature',
        description: 'Implement secure login functionality',
        status: 'inProgress',
        frd: true,
        bugs: [
          { id: 'b1', title: 'Button not clickable', label: 'functionality', priority: 'high' },
          { id: 'b2', title: 'Alignment issue', label: 'design', priority: 'low' },
        ],
        assignedUsers: ['Alice']
      },
    ],
    developers: ['Alice', 'Bob'],
    testers: ['Charlie', 'Dana'],
    members: ['Alice', 'Bob', 'Charlie', 'Dana'],
  },
  {
    id: '2',
    name: 'Project Beta',
    environments: ['Development', 'Production'],
    tasks: [],
    developers: ['Bob', 'Eve'],
    testers: ['Frank'],
    members: ['Bob', 'Eve', 'Frank'],
  }
];

// Types for the dialog components
interface Organization {
  _id: string;
  name: string;
}

interface UserListItem {
  _id: string;
  name: string;
}

interface NewProject {
  name: string;
  organizationId: string;
  environment: string;
  members: string[];
}

interface ProjectCreationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (project: NewProject) => void;
}

interface NewTask {
  id: string;
  name: string;
  description: string;
  status: 'yetToStart' | 'inProgress' | 'completed';
  frd: boolean;
  bugs: { id: string; title: string; label: string; priority: string; }[];
  assignedUsers: string[];
}

interface TaskCreationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: NewTask, projectId: string) => void;
  projects: Array<{id: string, name: string, members: string[]}>;
  selectedProjectId: string;
}

// Project creation dialog component
function ProjectCreationDialog({ isOpen, onClose, onSubmit }: ProjectCreationDialogProps) {
  const [projectName, setProjectName] = useState('');
  const [environment, setEnvironment] = useState('prod');
  const [selectedOrg, setSelectedOrg] = useState('');
  const [members, setMembers] = useState<string[]>([]);
  const [allUsers, setAllUsers] = useState<UserListItem[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  
  useEffect(() => {
    // Simulating API call to fetch organizations
    setOrganizations([
      { _id: 'org1', name: 'Organization Alpha' },
      { _id: 'org2', name: 'Organization Beta' }
    ]);
  }, []);

  useEffect(() => {
    if (selectedOrg) {
      // Simulating API call to fetch users from the selected organization
      const dummyUsers = [
        { _id: 'user1', name: 'Alice Johnson' },
        { _id: 'user2', name: 'Bob Smith' },
        { _id: 'user3', name: 'Charlie Davis' },
        { _id: 'user4', name: 'Dana White' }
      ];
      setAllUsers(dummyUsers);
    }
  }, [selectedOrg]);

  const handleUserToggle = (userId: string) => {
    setMembers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Create new project object
    const newProject = {
      name: projectName,
      organizationId: selectedOrg,
      environment,
      members,
    };
    onSubmit(newProject);
    // Reset form
    setProjectName('');
    setEnvironment('prod');
    setSelectedOrg('');
    setMembers([]);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.dialogOverlay}>
      <div className={styles.dialogContent}>
        <h2 className={styles.dialogTitle}>Create New Project</h2>
        <form onSubmit={handleSubmit} className={styles.dialogForm}>
          <label className={styles.label}>Project Name</label>
          <input 
            className={styles.input} 
            value={projectName} 
            onChange={(e) => setProjectName(e.target.value)} 
            required 
          />

          <label className={styles.label}>Environment</label>
          <select 
            className={styles.select} 
            value={environment} 
            onChange={(e) => setEnvironment(e.target.value)}
          >
            <option value="prod">Production</option>
            <option value="non-prod">Non-Production</option>
            <option value="staging">Staging</option>
          </select>

          {currentUser.role === 'product manager' && (
            <>
              <label className={styles.label}>Organization</label>
              <select
                className={styles.select}
                value={selectedOrg}
                onChange={(e) => setSelectedOrg(e.target.value)}
                required
              >
                <option value="">Select Organization</option>
                {organizations.map((org) => (
                  <option key={org._id} value={org._id}>{org.name}</option>
                ))}
              </select>
            </>
          )}

          {selectedOrg && (
            <div className={styles.userList}>
              <label className={styles.label}>Assign Members</label>
              {allUsers.map((usr) => (
                <div key={usr._id} className={styles.userItem}>
                  <input
                    type="checkbox"
                    checked={members.includes(usr._id)}
                    onChange={() => handleUserToggle(usr._id)}
                  />
                  <span>{usr.name}</span>
                </div>
              ))}
            </div>
          )}

          <div className={styles.dialogButtons}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" className={styles.submitButton}>
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Task creation dialog component
function TaskCreationDialog({ isOpen, onClose, onSubmit, projects, selectedProjectId }: TaskCreationDialogProps) {
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskStatus, setTaskStatus] = useState<'yetToStart' | 'inProgress' | 'completed'>('yetToStart');
  const [assignedUsers, setAssignedUsers] = useState<string[]>([]);
  const [selectedProject, setSelectedProject] = useState(selectedProjectId);
  
  // Reset the form when the dialog opens with the currently selected project
  useEffect(() => {
    if (isOpen) {
      setSelectedProject(selectedProjectId);
    }
  }, [isOpen, selectedProjectId]);
  
  // Get members of the currently selected project
  const currentProjectMembers = projects.find(p => p.id === selectedProject)?.members || [];

  const handleUserToggle = (userName: string) => {
    setAssignedUsers((prev) =>
      prev.includes(userName) ? prev.filter((name) => name !== userName) : [...prev, userName]
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Create new task object
    const newTask: NewTask = {
      id: `t${Date.now()}`, // Generate a temporary id
      name: taskName,
      description: taskDescription,
      status: taskStatus,
      frd: false, // Default value
      bugs: [], // Initialize with empty array
      assignedUsers: assignedUsers,
    };
    
    onSubmit(newTask, selectedProject);
    
    // Reset form
    setTaskName('');
    setTaskDescription('');
    setTaskStatus('yetToStart');
    setAssignedUsers([]);
  };
  
  // Handle project selection change
  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newProjectId = e.target.value;
    setSelectedProject(newProjectId);
    // Clear selected users when switching projects
    setAssignedUsers([]);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.dialogOverlay}>
      <div className={styles.dialogContent}>
        <h2 className={styles.dialogTitle}>Create New Task</h2>
        <form onSubmit={handleSubmit} className={styles.dialogForm}>
          <label className={styles.label}>Project</label>
          <select 
            className={styles.select} 
            value={selectedProject} 
            onChange={handleProjectChange}
            required
          >
            <option value="">Select Project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>
          
          <label className={styles.label}>Task Name</label>
          <input 
            className={styles.input} 
            value={taskName} 
            onChange={(e) => setTaskName(e.target.value)} 
            required 
          />

          <label className={styles.label}>Description</label>
          <textarea 
            className={styles.textarea} 
            value={taskDescription} 
            onChange={(e) => setTaskDescription(e.target.value)} 
            required 
            rows={4}
          />

          <label className={styles.label}>Status</label>
          <select 
            className={styles.select} 
            value={taskStatus} 
            onChange={(e) => setTaskStatus(e.target.value as 'yetToStart' | 'inProgress' | 'completed')}
          >
            <option value="yetToStart">Yet To Start</option>
            <option value="inProgress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          {selectedProject && (
            <div className={styles.userList}>
              <label className={styles.label}>Assign Members</label>
              {currentProjectMembers.length > 0 ? (
                currentProjectMembers.map((member) => (
                  <div key={member} className={styles.userItem}>
                    <input
                      type="checkbox"
                      checked={assignedUsers.includes(member)}
                      onChange={() => handleUserToggle(member)}
                    />
                    <span>{member}</span>
                  </div>
                ))
              ) : (
                <p className={styles.noMembersMessage}>No members available for this project</p>
              )}
            </div>
          )}

          <div className={styles.dialogButtons}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" className={styles.submitButton}>
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [selectedProject, setSelectedProject] = useState(dummyProjects[0]);
  const [projects, setProjects] = useState(dummyProjects);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('tasks');
  const router = useRouter();

  useEffect(() => {
    if (currentUser.role !== 'product manager') {
      const assigned = dummyProjects.filter(
        (project) =>
          project.developers.includes(currentUser.name) ||
          project.testers.includes(currentUser.name)
      );
      setProjects(assigned);
      if (assigned.length > 0) {
        setSelectedProject(assigned[0]);
      }
    }
  }, []);

  const handleAddProject = () => {
    setIsProjectDialogOpen(true);
  };

  const handleProjectDialogClose = () => {
    setIsProjectDialogOpen(false);
  };

  const handleAddTask = () => {
    setIsTaskDialogOpen(true);
  };

  const handleTaskDialogClose = () => {
    setIsTaskDialogOpen(false);
  };

  const handleProjectSubmit = (newProject: NewProject) => {
    // Add the new project to the projects list
    const projectWithId = {
      id: `${projects.length + 1}`,
      name: newProject.name,
      environments: [newProject.environment],
      tasks: [],
      developers: [],
      testers: [],
      members: [], // Add members from the API response
    };
    
    setProjects([...projects, projectWithId]);
    setIsProjectDialogOpen(false);
  };

  const handleTaskSubmit = (newTask: NewTask, projectId: string) => {
    // Add the new task to the selected project
    const updatedProjects = projects.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          tasks: [...project.tasks, newTask]
        };
      }
      return project;
    });
    
    setProjects(updatedProjects);
    
    // If the task was added to the currently selected project, update the selected project state
    if (projectId === selectedProject.id) {
      const updatedSelectedProject = updatedProjects.find(p => p.id === selectedProject.id);
      if (updatedSelectedProject) {
        setSelectedProject(updatedSelectedProject);
      }
    }
    
    setIsTaskDialogOpen(false);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'yetToStart':
        return styles.statusBadgeNotStarted;
      case 'inProgress':
        return styles.statusBadgeInProgress;
      case 'completed':
        return styles.statusBadgeCompleted;
      default:
        return '';
    }
  };

  const renderStatusLabel = (status: string) => {
    switch (status) {
      case 'yetToStart':
        return 'Yet To Start';
      case 'inProgress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Project Dashboard</h1>
        {currentUser.role === 'product manager' && (
          <Button onClick={handleAddProject} className={styles.addProjectButton}>
            <Plus className={styles.plusIcon} /> Add Project
          </Button>
        )}
      </div>

      <div className={styles.projectGrid}>
        {projects.map((project) => (
          <Card
            key={project.id}
            onClick={() => setSelectedProject(project)}
            className={`${styles.projectCard} ${
              selectedProject?.id === project.id ? styles.selectedProject : ''
            }`}
          >
            <CardHeader>
              <CardTitle className={styles.projectTitle}>{project.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={styles.environmentLabel}>Environments:</p>
              <ul className={styles.environmentList}>
                {project.environments.map((env) => (
                  <li key={env}>{env}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="tasks">
        <TabsList className={styles.tabsList}>
          <TabsTrigger 
            value="tasks" 
            activeTab={activeTab} 
            handleTabChange={() => handleTabChange('tasks')}
          >
            <ListTodo className={styles.tabIcon} /> Tasks
          </TabsTrigger>
          <TabsTrigger 
            value="frd" 
            activeTab={activeTab} 
            handleTabChange={() => handleTabChange('frd')}
          >
            <FileText className={styles.tabIcon} /> FRDs
          </TabsTrigger>
          <TabsTrigger 
            value="bugs" 
            activeTab={activeTab} 
            handleTabChange={() => handleTabChange('bugs')}
          >
            <Bug className={styles.tabIcon} /> Bugs
          </TabsTrigger>
          <TabsTrigger 
            value="members" 
            activeTab={activeTab} 
            handleTabChange={() => handleTabChange('members')}
          >
            <Users className={styles.tabIcon} /> Members
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" activeTab={activeTab}>
          <div className={styles.tabContentContainer}>
            {selectedProject?.tasks.map((task) => (
              <Card key={task.id} className={styles.taskCard}>
                <CardHeader>
                  <CardTitle>{task.name}</CardTitle>
                  {task.status && (
                    <div className={`${styles.statusBadge} ${getStatusBadgeClass(task.status)}`}>
                      {renderStatusLabel(task.status)}
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <p className={styles.taskDescription}>{task.description}</p>
                  {task.assignedUsers && task.assignedUsers.length > 0 && (
                    <div className={styles.assignedUsers}>
                      <p className={styles.assignedUsersLabel}>Assigned to:</p>
                      <ul className={styles.assignedUsersList}>
                        {task.assignedUsers.map((user) => (
                          <li key={user} className={styles.assignedUser}>{user}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            <Button onClick={handleAddTask} className={styles.addButton}>+ Add Task</Button>
          </div>
        </TabsContent>

        <TabsContent value="frd" activeTab={activeTab}>
          <div className={styles.tabContentContainer}>
            {selectedProject?.tasks
              .filter(task => task.frd)
              .map((task) => (
                <Card key={task.id} className={styles.frdCard}>
                  <CardHeader>
                    <CardTitle>{task.name}</CardTitle>
                  </CardHeader>
                </Card>
              ))}
            <Button className={styles.addButton}>+ Add FRD</Button>
          </div>
        </TabsContent>

        <TabsContent value="bugs" activeTab={activeTab}>
          <div className={styles.tabContentContainer}>
            {selectedProject?.tasks.flatMap(task =>
              task.bugs ? task.bugs.map(bug => (
                <Card key={bug.id} className={styles.bugCard}>
                  <CardHeader>
                    <CardTitle>{bug.title}</CardTitle>
                    <div className={`${styles.priorityBadge} ${styles[`priority${bug.priority}`]}`}>
                      {bug.priority}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className={styles.bugLabel}>{bug.label}</div>
                    <p className={styles.relatedTask}>Related Task: {task.name}</p>
                  </CardContent>
                </Card>
              )) : []
            )}
            <Button className={styles.addButton}>+ Add Bug</Button>
          </div>
        </TabsContent>

        <TabsContent value="members" activeTab={activeTab}>
          <div className={styles.membersContainer}>
            <div className={styles.memberSection}>
              <h3 className={styles.memberSectionTitle}>Developers</h3>
              <ul className={styles.memberList}>
                {selectedProject?.developers.map((dev) => (
                  <li key={dev} className={styles.memberItem}>{dev}</li>
                ))}
              </ul>
            </div>
            <div className={styles.memberSection}>
              <h3 className={styles.memberSectionTitle}>Testers</h3>
              <ul className={styles.memberList}>
                {selectedProject?.testers.map((tester) => (
                  <li key={tester} className={styles.memberItem}>{tester}</li>
                ))}
              </ul>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Project Creation Dialog */}
      <ProjectCreationDialog 
        isOpen={isProjectDialogOpen} 
        onClose={handleProjectDialogClose} 
        onSubmit={handleProjectSubmit} 
      />

      {/* Task Creation Dialog */}
      <TaskCreationDialog 
        isOpen={isTaskDialogOpen}
        onClose={handleTaskDialogClose}
        onSubmit={handleTaskSubmit}
        projects={projects.map(p => ({
          id: p.id,
          name: p.name,
          members: p.members || [...p.developers, ...p.testers]
        }))}
        selectedProjectId={selectedProject?.id || ''}
      />
    </div>
  );
}
// interface User {
//   id: string;
//   name: string;
//   role: string;
// }

// interface Task {
//   id: string;
//   name: string;
//   frd: boolean;
//   bugs: Bug[];
// }

// interface Bug {
//   id: string;
//   title: string;
//   label: string;
//   priority: string;
// }

// interface Project {
//   id: string;
//   name: string;
//   environments: string[];
//   tasks: Task[];
//   developers: string[];
//   testers: string[];
// }

// interface Organization {
//   _id: string;
//   name: string;
// }

// interface UserListItem {
//   _id: string;
//   name: string;
// }

// interface NewProject {
//   name: string;
//   organizationId: string;
//   environment: string;
//   members: string[];
// }

// interface ProjectCreationDialogProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSubmit: (project: NewProject) => void;
// }
// const userId=useSession()
// const fetchCurrentUser = async (userId: string): Promise<User> => {
//   try {
//     const response = await fetch(`/api/users/${userId}`);
//     if (!response.ok) {
//       throw new Error('Failed to fetch user');
//     }
//     return await response.json();
//   } catch (error) {
//     console.error('Error fetching current user:', error);
//     return {
//       id: 'u123',
//       name: 'Jane Doe',
//       role: 'product manager',
//     };
//   }}
// const fetchProjects = async (): Promise<Project[]> => {
//     try {
//       const response = await fetch(`/api/projects/user/${userId}`);
//       if (!response.ok) {
//         throw new Error('Failed to fetch projects');
//       }
//       return await response.json();
//     } catch (error) {
//       console.error('Error fetching projects:', error);
//       // Return empty array or fallback data
//       return [];
//     }
//   };

//   const fetchUsersInOrganization = async (orgId: string): Promise<UserListItem[]> => {
//     try {
//       const response = await fetch(`/api/organizations/${orgId}/users`);
//       if (!response.ok) {
//         throw new Error('Failed to fetch users');
//       }
//       return await response.json();
//     } catch (error) {
//       console.error('Error fetching users:', error);
//       return [];
//     }
//   };
