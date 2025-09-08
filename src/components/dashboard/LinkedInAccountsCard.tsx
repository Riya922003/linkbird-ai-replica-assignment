import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckmarkIcon } from "@/components/ui/checkmark-icon";
import Image from "next/image";

export const LinkedInAccountsCard = () => {
  // Sample LinkedIn accounts data for dashboard display
  // TODO: Replace with real LinkedIn accounts data from database when LinkedIn integration is implemented
  const accounts: Array<{
    name: string;
    email: string;
    progress: string;
    count: string;
  }> = [
    { name: "Pulkit Garg", email: "pulkit@company.com", progress: "57%", count: "17/30" },
    { name: "Jivesh Lakhani", email: "jivesh@company.com", progress: "63%", count: "19/30" },
    { name: "Indrajit Sahani", email: "indrajit@company.com", progress: "60%", count: "18/30" },
    { name: "Bhavya Arora", email: "bhavya@company.com", progress: "45%", count: "15/30" },
  ];

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-1 px-3 pt-2 flex-shrink-0">
        <CardTitle className="text-lg font-semibold">LinkedIn Accounts</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 px-3 pb-1">
        <div className="flex items-center border-b pb-1 mb-1">
          <span className="text-sm text-slate-500 flex-1">Account</span>
          <span className="text-sm text-slate-500 w-20 text-center">Status</span>
          <span className="text-sm text-slate-500 w-16 text-center">Requests</span>
        </div>
        
        {/* Account List */}
        <div>
          {accounts.map((account, index) => (
            <div key={index} className="flex items-center py-0.5">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                  <Image 
                    src="https://placehold.co/32x32" 
                    alt={account.name}
                    width={24}
                    height={24}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium truncate">{account.name}</span>
                    <div className="w-3 h-3 bg-yellow-500 rounded flex items-center justify-center flex-shrink-0">
                      <span className="text-[8px] font-bold text-white">in</span>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 truncate">{account.email}</div>
                </div>
              </div>
              <div className="w-20 flex justify-center flex-shrink-0">
                <div className="bg-blue-600 text-white px-2 py-0.5 rounded text-xs flex items-center gap-1">
                  <CheckmarkIcon className="h-2 w-2" />
                  <span>Connected</span>
                </div>
              </div>
              <div className="w-16 flex items-center justify-center flex-shrink-0">
                <div className="flex flex-col items-center">
                  <div className="w-12 bg-gray-200 rounded-full h-1">
                    <div className="bg-blue-600 h-1 rounded-full" style={{width: account.progress}}></div>
                  </div>
                  <span className="text-xs mt-0.5">{account.count}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
