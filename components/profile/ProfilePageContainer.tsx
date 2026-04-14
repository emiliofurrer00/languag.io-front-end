import {
  Book,
  BookOpen,
  Calendar,
  FileStack,
  FlameIcon,
  Layers,
  Toolbox,
  ToolCase,
  Trophy,
  User,
} from 'lucide-react';
import NeoBox from '../ui/NeoBox';
import ProfilePicture from './ProfilePicture';

export default function ProfilePageContainer() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 pt-">
      {/* Profile Header */}
      <NeoBox className="text-center flex flex-col gap-4 md:gap-8 md:flex-row md:text-left md:items-start">
        <div>
          <ProfilePicture initials="JD" color="teal" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold">Emilio Emiliano</h2>
          <p className="mb-2 text-gray-500">@johndoe</p>
          <p className=" mb-4 text-sm">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua.
          </p>
          <div className="flex gap-3 justify-center md:justify-start text-gray-500 text-sm">
            <p>john.doe@example.com</p>
            <p>Public</p>
          </div>
        </div>
      </NeoBox>
      {/* Profile Stats */}
      {/* use 4 neoboxes to be displayed in two rows */}
      <div className="grid grid-cols-2 grid-rows-2 gap-4 lg:grid-cols-4 lg:grid-rows-1 mt-8 ">
        <NeoBox className="text-center flex flex-col items-center gap-2" shadowOffset="3px">
          <NeoBox padding="p-3" className="bg-neo-yellow" shadowOffset="3px" borderWidth="2px">
            <Layers className="w-6 h-6 text-foreground" />
          </NeoBox>
          <div>
            <p className="text-2xl font-bold">12</p>
            <p className="text-xs">Decks Created</p>
          </div>
        </NeoBox>
        <NeoBox className="text-center flex flex-col items-center gap-2" shadowOffset="3px">
          <NeoBox padding="p-3" className="bg-neo-teal" shadowOffset="3px" borderWidth="2px">
            <BookOpen className="w-6 h-6 text-foreground" />
          </NeoBox>
          <p className="text-2xl font-bold">120</p>
          <p className="text-xs">Cards Studied</p>
        </NeoBox>
        <NeoBox className="text-center flex flex-col items-center gap-2" shadowOffset="3px">
          <NeoBox padding="p-3" className="bg-neo-magenta" shadowOffset="3px" borderWidth="2px">
            <Trophy className="w-6 h-6 text-foreground" />
          </NeoBox>
          <p className="text-2xl font-bold">8</p>
          <p className="text-xs">Mastered Decks</p>
        </NeoBox>
        <NeoBox className="text-center flex flex-col items-center gap-2" shadowOffset="3px">
          <NeoBox padding="p-3" className="bg-neo-coral" shadowOffset="3px" borderWidth="2px">
            <FlameIcon className="w-6 h-6 text-foreground" />
          </NeoBox>
          <p className="text-2xl font-bold">5</p>
          <p className="text-xs">Study Streak Days</p>
        </NeoBox>
      </div>
      {/* About & Preferences */}
      <div className="grid grid-cols-1 grid-rows-2 md:grid-rows-1 md:grid-cols-2 mt-8 gap-6">
        <NeoBox alignItems="left" justifyContent="start">
          <div className="flex items-center gap-1 mb-4">
            <User className="w-6 h-6" />
            <h6 className="text-left font-semibold text-xl">About</h6>
          </div>
          <p className="text-sm">I am a passionate language learner and educator.</p>
          <div className="flex items-center gap-1 mt-3">
            <Calendar className="w-4 h-4" />
            <p className="text-sm">Joined March 2026</p>
          </div>
        </NeoBox>
        <NeoBox alignItems="left" justifyContent="start">
          <div className="flex items-center gap-1">
            <ToolCase className="w-6 h-6" />
            <h6 className="text-left font-semibold text-xl">Preferences</h6>
          </div>
        </NeoBox>
      </div>
      {/* Recent Activity */}
      <div className="mt-8">
        <NeoBox alignItems="left" justifyContent="start">
          <h6 className="text-lg font-semibold mb-4">Recent Activity</h6>
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <FileStack className="w-5 h-5 text-neo-magenta" />
              <div>
                <p className="text-sm font-medium">Created new deck "Spanish Basics"</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </li>
            <li className="flex items-center gap-3">
              <Book className="w-5 h-5 text-neo-teal" />
              <div>
                <p className="text-sm font-medium">Studied "French Verbs" deck</p>
                <p className="text-xs text-gray-500">1 day ago</p>
              </div>
            </li>
            <li className="flex items-center gap-3">
              <Trophy className="w-5 h-5 text-neo-yellow" />
              <div>
                <p className="text-sm font-medium">Mastered "German Vocabulary" deck</p>
                <p className="text-xs text-gray-500">3 days ago</p>
              </div>
            </li>
          </ul>
        </NeoBox>
      </div>
    </div>
  );
}
