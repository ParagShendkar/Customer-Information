import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

("use client");

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from "./components/ui/button";
import axios from "axios";
import { useEffect, useState } from "react";
import { Input } from "./components/ui/input";


type Customer = {
    id: number;
    username: string;
    phoneNumber: string;
    city: string;
    dateOfBirth: string;
};

type PageData = {
    size: number;
    totalCustomers: number;
    totalPages: number;
    page: number;
};

type CustomerResponse = {
    content: Customer[];
    page: PageData; // Assuming this holds paging information.
};

export function App() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [page, setPage] = useState<number>(0);
    const [size] = useState<number>(10);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [filterType, setFilterType] = useState("username");
    const [filterValue, setFilterValue] = useState<string | string[]>([]);
    const [ageList, setAgeList] = useState<number[]>([]);

    const fetchCustomers = async (currentPage: number) => {
        try {
            const response = await axios.get<CustomerResponse>(
                `http://localhost:8080/customer/customers?page=${currentPage}&size=${size}`
            );
            setCustomers(response.data.content || []);
            setTotalPages(response.data.page.totalPages || 1);
            setPage(response.data.page.page || 0);
        } catch (error) {
            console.error("Error fetching customers:", error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value =
            filterType === "city"
                ? e.target.value.split(",").map((city) => city.trim())
                : e.target.value;
        setFilterValue(value);
    };

    const handleFilterChange = (value: string) => {
        setFilterType(value);
        setFilterValue(""); // Reset input value when filter changes
    };

    const calculateAge = (dateOfBirth: string): number => {
        const [year, month, day] = dateOfBirth.split("-").map(Number);
        const dob = new Date(year, month - 1, day);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const monthDifference = today.getMonth() - dob.getMonth();

        if (
            monthDifference < 0 ||
            (monthDifference === 0 && today.getDate() < dob.getDate())
        ) {
            age--;
        }

        return age;
    };

    const fetchAllDOB = async (): Promise<string[]> => {
        try {
            const response = await axios.get<string[]>(
                "http://localhost:8080/customer/get_all_dob"
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching date of birth:", error);
            return [];
        }
    };

    useEffect(() => {
        const fetchDOBs = async () => {
            const dobList = await fetchAllDOB();
            const ages = dobList.map((dob) => calculateAge(dob));
            setAgeList(ages); // Store ages in state
            console.log("List of date of birth:", dobList);
            console.log("Calculated Ages:", ages);
        };

        fetchDOBs();
        fetchCustomers(page);
    }, [page]);

    // Age categorization
    const ageDistribution = () => {
        let ten = 0;
        let twenty = 0;
        let thirty = 0;
        let forty = 0;
        let fifty = 0;
        let sixty = 0;
        let sixtyAbove = 0;

        ageList.forEach((element: number) => {
            if (element >= 0 && element <= 10) {
                ten++;
            } else if (element >= 11 && element <= 20) {
                twenty++;
            } else if (element >= 21 && element <= 30) {
                thirty++;
            } else if (element >= 31 && element <= 40) {
                forty++;
            } else if (element >= 41 && element <= 50) {
                fifty++;
            } else if (element >= 51 && element <= 60) {
                sixty++;
            } else if (element >= 61) {
                sixtyAbove++;
            }
        });

        return [
            { age: "0-10", desktop: ten },
            { age: "11-20", desktop: twenty },
            { age: "21-30", desktop: thirty },
            { age: "31-40", desktop: forty },
            { age: "41-50", desktop: fifty },
            { age: "51-60", desktop: sixty },
            { age: "61>", desktop: sixtyAbove },
        ];
    };

    const chartData = ageDistribution();
    console.log(chartData);

    const handleSubmit = async () => {
        try {
            let response;
            if (filterType === "username") {
                response = await axios.get(
                    `http://localhost:8080/customer/filterByUsername?username=${filterValue}`
                );
                setCustomers([response.data]); // Single customer response
            } else if (filterType === "phoneNumber") {
                response = await axios.get(
                    `http://localhost:8080/customer/filterByPhoneNumber?phoneNumber=${filterValue}`
                );
                setCustomers([response.data]); // Single customer response
            } else if (filterType === "city") {
                response = await axios.post(
                    `http://localhost:8080/customer/filterByCity`,
                    {
                        cities: Array.isArray(filterValue) ? filterValue : [filterValue],
                    }
                );
                setCustomers(response.data); // Array of customers
            }
        } catch (error) {
            console.error("Error fetching customers:", error);
            setCustomers([]); // Clear customers on error
        }
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        fetchCustomers(newPage);
    };

    const chartConfig = {
      desktop: {
        label: "Desktop",
        color: "#2563eb",
      },
      mobile: {
        label: "Mobile",
        color: "#60a5fa",
      },
    } satisfies ChartConfig;

  return (
    <div className="flex flex-row  m-4">
      <div className="p-4   ">
        <div className="flex w-full max-w-l items-center space-x-2">
          <Input
            type="text"
            placeholder={
              filterType === "city"
                ? "Enter cities (comma-separated)"
                : `Enter ${filterType}`
            }
            className="max-w-sm justify-center"
            value={filterValue}
            onChange={handleInputChange}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Filter</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Filter Customer By:</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={filterType}
                onValueChange={handleFilterChange}
              >
                <DropdownMenuRadioItem value="username">
                  Username
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="phoneNumber">
                  Phone Number
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="city">City</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button type="button" onClick={handleSubmit}>
            Search
          </Button>
        </div>

        <Table className="w-full border-collapse border border-gray-200 mt-4">
          <TableCaption className="text-left text-gray-600 font-medium p-2">
            A list of customers.
          </TableCaption>
          <TableHeader className="bg-gray-100">
            <TableRow className="border-b">
              <TableHead className="w-[100px] p-2 border-r">Sr No.</TableHead>
              <TableHead className="p-2 border-r">Username</TableHead>
              <TableHead className="p-2 border-r">Phone Number</TableHead>
              <TableHead className="p-2 text-center">Date of Birth</TableHead>
              <TableHead className="p-2 text-right">City</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.length > 0 ? (
              customers.map((customer, index) => (
                <TableRow
                  key={customer.id}
                  className="border-b hover:bg-gray-50"
                >
                  <TableCell className="font-medium p-2 border-r">
                    {index + 1 + page * size}
                  </TableCell>
                  <TableCell className="p-2 border-r">
                    {customer.username}
                  </TableCell>
                  <TableCell className="p-2 border-r">
                    {customer.phoneNumber}
                  </TableCell>
                  <TableCell className="p-2 text-center">
                    {customer.dateOfBirth}
                  </TableCell>
                  <TableCell className="p-2 text-right">
                    {customer.city}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center p-2">
                  No customers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter />
        </Table>

        <div className="flex justify-center w-full mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page > 0) handlePageChange(page - 1);
                  }}
                />
              </PaginationItem>
              {[...Array(totalPages).keys()].map((pg) => (
                <PaginationItem key={pg}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(pg);
                    }}
                    className={pg === page ? "font-bold" : ""}
                  >
                    {pg + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page < totalPages - 1) handlePageChange(page + 1);
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
      <div className="m-10 pt-10     max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Bar Chart - Age Group Data</CardTitle>
            <CardDescription>Age 0-100</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <BarChart
                accessibilityLayer
                data={chartData}
                margin={{
                  top: 20,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="age"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 5)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8}>
                  <LabelList
                    position="top"
                    offset={12}
                    className="fill-foreground"
                    fontSize={12}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none">
              This chart shows the data of different age Group. <TrendingUp className="h-4 w-4" />
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
