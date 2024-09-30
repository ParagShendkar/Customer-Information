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
import { Button } from "./components/ui/button";
import axios from "axios";
import { useEffect, useState } from "react";
import { Input } from "./components/ui/input";
import React from "react";

type Customer = {
  id: number;
  username: string;
  phoneNumber: string;
  city: string;
};

type PageData = {
  size: number;
  totalCustomers: number;
  totalPages: number;
  page: number;
};

export function App() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [page, setPage] = useState<number>(0);
  const [size] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [filterType, setFilterType] = useState("username");
  const [filterValue, setFilterValue] = useState<string | string[]>([]);

  const fetchCustomers = async (currentPage: number) => {
    try {
      const response = await axios.get(
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
    const value = filterType === "city" ? e.target.value.split(",").map(city => city.trim()) : e.target.value;
    setFilterValue(value);
  };

  const handleFilterChange = (value: string) => {
    setFilterType(value);
    setFilterValue(""); // Reset input value when filter changes
  };

 const handleSubmit = async () => {
    try {
        let response;
        if (filterType === "username") {
            // Call the username endpoint with GET
            response = await axios.get(`http://localhost:8080/customer/filterByUsername?username=${filterValue}`);
            setCustomers([response.data]); // Single customer response
        } else if (filterType === "phoneNumber") {
            // Call the phone number endpoint with GET
            response = await axios.get(`http://localhost:8080/customer/filterByPhoneNumber?phoneNumber=${filterValue}`);
            setCustomers([response.data]); // Single customer response
        } else if (filterType === "city") {
            // Call the city endpoint with POST
            response = await axios.post(`http://localhost:8080/customer/filterByCity`, {
                cities: Array.isArray(filterValue) ? filterValue : [filterValue],
            });
            setCustomers(response.data); // Array of customers
        }
    } catch (error) {
        console.error("Error fetching customers:", error);
        setCustomers([]); // Clear customers on error
    }
};


  useEffect(() => {
    fetchCustomers(page);
  }, [page]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchCustomers(newPage);
  };

  return (
    <div className="m-4">
      <div className="p-4">
        <div className="flex w-full max-w-l items-center space-x-2">
          <Input
            type="text"
            placeholder={filterType === "city" ? "Enter cities (comma-separated)" : `Enter ${filterType}`}
            className="max-w-sm justify-center"
            value={Array.isArray(filterValue) ? filterValue.join(", ") : filterValue}
            onChange={handleInputChange}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Filter</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Filter Customer By:</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={filterType} onValueChange={handleFilterChange}>
                <DropdownMenuRadioItem value="username">Username</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="phoneNumber">Phone Number</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="city">City</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button type="submit" onClick={handleSubmit}>Search</Button>
        </div>

        <Table className="w-full border-collapse border border-gray-200 mt-4">
          <TableCaption className="text-left text-gray-600 font-medium p-2">A list of customers.</TableCaption>
          <TableHeader className="bg-gray-100">
            <TableRow className="border-b">
              <TableHead className="w-[100px] p-2 border-r">Sr No.</TableHead>
              <TableHead className="p-2 border-r">Username</TableHead>
              <TableHead className="p-2 border-r">Phone Number</TableHead>
              <TableHead className="p-2 text-right">City</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.length > 0 ? (
              customers.map((customer, index) => (
                <TableRow key={customer.id} className="border-b hover:bg-gray-50">
                  <TableCell className="font-medium p-2 border-r">{index + 1 + page * size}</TableCell>
                  <TableCell className="p-2 border-r">{customer.username}</TableCell>
                  <TableCell className="p-2 border-r">{customer.phoneNumber}</TableCell>
                  <TableCell className="p-2 text-right">{customer.city}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center p-2">No customers found.</TableCell>
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
    </div>
  );
}
