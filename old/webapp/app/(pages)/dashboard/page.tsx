import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { PencilIcon } from "lucide-react"
import NewBotForm from "@/components/NewBotForm"

export default function Dashboard() {

  let myBots = [
    { name: "Sales", site: "goodfood.com" },
    { name: "Marketing", site: "freshideas.com" },
    { name: "Help", site: "techworld.com" },
    { name: "Contact", site: "worklife.com" },
    { name: "Assistance", site: "moneymatters.com" }
  ]



  return (
    <div className="flex flex-col h-full">

      <main className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      <NewBotForm/>
        <div className="bg-white dark:bg-gray-950 rounded-lg shadow-sm">
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-medium">My Bots</h2>
          </div>
          <div className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Site</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myBots.map((bot) => {
                  return (
                    <TableRow>
                      <TableCell className="font-medium">{bot.name}</TableCell>
                      <TableCell>{bot.site}</TableCell>
                      <TableCell><Button>
                        <PencilIcon className="mr-2 h-4 w-4" /> Edit
                      </Button>
                      </TableCell>
                    </TableRow>)
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  )
}