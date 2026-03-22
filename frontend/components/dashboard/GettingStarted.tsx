import React, { useState } from 'react';
import Link from 'next/link';

// ################## ----- TASK INTERFACE ----- ##################
// Structure for individual getting started tasks
// Tracks completion status and optional actions
// ##########################################################
interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  actionUrl?: string;
  actionText?: string;
}

// ################## ----- GETTING STARTED PROPS ----- ##################
// Props interface for the getting started component
// Handles task completion callbacks and styling
// ################################################################
interface GettingStartedProps {
  onTaskComplete?: (taskId: string) => void;
  className?: string;
}

// ################## ----- GETTING STARTED COMPONENT ----- ##################
// Dashboard component showing onboarding progress and next steps
// Helps users track their setup progress and complete tasks
// ####################################################################
export const GettingStarted: React.FC<GettingStartedProps> = ({
  onTaskComplete,
  className = ''
}) => {
  // ################## ----- TASKS CONFIGURATION ----- ##################
  // Defines the getting started checklist for new users
  // Tasks are ordered by typical user workflow progression
  // ################################################################
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 'signup',
      title: 'Sign up for an account',
      description: 'Create your CreatorLaunch account',
      completed: true
    },
    {
      id: 'create-brand',
      title: 'Create your brand',
      description: 'Set up your store URL, description, and branding',
      completed: true
    },
    {
      id: 'first-product',
      title: 'Create your first product',
      description: 'Add your first product to start selling',
      completed: false,
      actionUrl: '/products/new',
      actionText: 'Add Product'
    },
    {
      id: 'first-sale',
      title: 'Share your store and make your first sale!',
      description: 'Share your store link and celebrate your first sale',
      completed: false,
      actionUrl: '/store/share',
      actionText: 'Share Store'
    }
  ]);

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progressPercentage = (completedTasks / totalTasks) * 100;

  const handleTaskAction = (taskId: string) => {
    if (onTaskComplete) {
      onTaskComplete(taskId);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-dark">Getting Started</h2>
        <span className="text-sm text-medium">
          {completedTasks}/{totalTasks} completed
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-dark">Progress</span>
          <span className="text-sm text-medium">{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {tasks.map((task, index) => (
          <div 
            key={task.id}
            className={`flex items-start space-x-3 p-4 rounded-lg border-2 transition-colors ${
              task.completed 
                ? 'bg-green-50 border-green-200' 
                : 'bg-gray-50 border-gray-200 hover:border-primary'
            }`}
          >
            {/* Checkbox */}
            <div className="flex-shrink-0 mt-1">
              {task.completed ? (
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              ) : (
                <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
              )}
            </div>

            {/* Task Content */}
            <div className="flex-1">
              <h3 className={`font-semibold ${task.completed ? 'text-green-700' : 'text-dark'}`}>
                {task.title}
              </h3>
              <p className={`text-sm mt-1 ${task.completed ? 'text-green-600' : 'text-medium'}`}>
                {task.description}
              </p>
            </div>

            {/* Action Button */}
            {!task.completed && task.actionUrl && (
              <div className="flex-shrink-0">
                <Link href={task.actionUrl}>
                  <button
                    onClick={() => handleTaskAction(task.id)}
                    className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors duration-200"
                  >
                    {task.actionText}
                  </button>
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Completion Message */}
      {completedTasks === totalTasks && (
        <div className="mt-6 p-4 bg-green-100 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold text-green-700">
              🎉 Congratulations! You've completed all getting started tasks!
            </span>
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-dark">Need help?</h4>
            <p className="text-sm text-medium">Check out our guides and tutorials</p>
          </div>
          <Link href="/help">
            <button className="text-accent hover:text-blue-600 font-medium text-sm transition-colors">
              Get Help →
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GettingStarted;
