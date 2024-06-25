import React from "react";

export type player = {
    id: string;
    player_id: string;
    score: number;
    // In TypeScript, this is called a string union type.
    // It means that the "status" property can only be one of the two strings: 'available' or 'unavailable'.
    status: 'available' | 'unavailable';
  };