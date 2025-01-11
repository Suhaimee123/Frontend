"use client";
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Box, Button } from "@mui/material";
import VolunteerForm from "./components/VolunteerForm";
import SpecialWorkForm from "./components/SpecialWorkForm";
import CheckHoursWork from "./components/checkHour";
import { useForm } from "react-hook-form";
import {  FormValuesWork } from "@/types/IResponse"; // Import the type for form values
import { submitVolunteerForm } from "../api/Volunteer";
import { submitSpecialWorkForm } from "../api/SpecialWork";
import { FormValues } from "@/types/Volunteer";

const Page: React.FC = () => {
  const [selectedForm, setSelectedForm] = useState<string>("volunteerForm"); // Set initial state to display VolunteerForm first

  // Initialize useForm for VolunteerForm and SpecialWorkForm
  const formVolunteer = useForm<FormValues>();
  const formWork = useForm<FormValuesWork>();

  const handleSidebarClick = (formName: string) => {
    setSelectedForm(formName); // Set the selected form based on the sidebar click
  };

  

  return (
    <Layout
      sidebarItems={[
        {
          text: "บันทึกชั่วโมงจิตอาสา",
          hook: () => handleSidebarClick("volunteerForm"), // Show volunteer form on click
        },
        {
          text: "บันทึกชั่วโมงงานพิเศษ",
          hook: () => handleSidebarClick("SpecialWorkForm"), // Show special work form on click
        },
        {
          text: "ตรวจสอบชั่วโมงจิตอาสา",
          hook: () => handleSidebarClick("CheckHoursForm"), // Show check hours form on click
        },
      ]}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <Box
          sx={{
            width: "100%",
            padding: 2,
            backgroundColor: "background.paper",
            borderRadius: 1,
            boxShadow: 1,
          }}
        >
          {/* Conditionally render the form based on selectedForm */}
          {selectedForm === "volunteerForm" && (
            <VolunteerForm formValunteer={formVolunteer} />
          )}
          {selectedForm === "SpecialWorkForm" && (
            <SpecialWorkForm formwork={formWork} />
          )}
          {selectedForm === "CheckHoursForm" && <CheckHoursWork />}

          {/* Conditionally render the Submit button */}
          {selectedForm !== "CheckHoursForm" }
        </Box>
      </Box>
    </Layout>
  );
};

export default Page;
