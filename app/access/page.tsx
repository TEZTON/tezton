"use client"
import { SearchIcon } from "lucide-react";
import { useContext, useState } from "react";
import { AccessComponent } from "@/components/access";
import { AppTemplate } from "@/components/templates/Template";

export default function Access() {

    return (
        <AppTemplate>
            <AccessComponent/>
        </AppTemplate>
    );
};
