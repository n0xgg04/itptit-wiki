import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tables } from "@/supabase/database.types";

interface ProfileCardProps {
    data: Partial<Tables<"members">>;
}

export function ProfileCard({ data }: ProfileCardProps) {
    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <Avatar className="h-16 w-16">
                    <AvatarImage src={data?.main_pic} alt={data?.fullname} />
                    <AvatarFallback>{data?.fullname?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle>{data?.fullname}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                        {data?.student_code}
                    </p>
                </div>
            </CardHeader>
            <CardContent>
                <dl className="grid grid-cols-1 gap-2 text-sm">
                    <div className="flex justify-between">
                        <dt className="font-medium">Khoá :D</dt>
                        <dd>{data?.batch}</dd>
                    </div>
                    <div className="flex justify-between">
                        <dt className="font-medium">Email:</dt>
                        <dd>{data?.email}</dd>
                    </div>
                    <div className="flex justify-between">
                        <dt className="font-medium">Số điện thoại:</dt>
                        <dd>{data?.phone_number}</dd>
                    </div>
                    <div className="flex justify-between">
                        <dt className="font-medium">Facebook:</dt>
                        <dd>
                            <a target="_blank" href={data?.facebook_link!}>
                                Link facebook
                            </a>
                        </dd>
                    </div>
                    <div className="flex justify-between">
                        <dt className="font-medium">Team:</dt>
                        <dd>{data?.team}</dd>
                    </div>
                </dl>
            </CardContent>
        </Card>
    );
}
