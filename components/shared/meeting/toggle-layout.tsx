import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Grid2x2, Layout, LayoutDashboard } from 'lucide-react'

type ToggleLayoutProps = {
  layout: string
  setLayout: any
}

const ToggleLayout = ({ layout, setLayout }: ToggleLayoutProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="flex items-center justify-center border h-10 w-10 rounded-full">
          <LayoutDashboard className="w-6 h-6 cursor-pointer" onClick={ () => setLayout (layout) }/>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          Change Layout
        </DropdownMenuLabel>
        <DropdownMenuSeparator/>
        <DropdownMenuItem onClick={ () => setLayout ('speaker-left') }>
          Speaker Left
        </DropdownMenuItem>
        <DropdownMenuItem onClick={ () => setLayout ('speaker-right') }>
          Speaker Right
        </DropdownMenuItem>
        <DropdownMenuItem onClick={ () => setLayout ('grid') }>
          Grid
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ToggleLayout