import React from 'react';
// @mui
import { Stack, Skeleton } from '@material-ui/core';

// ----------------------------------------------------------------------

export default function SkeletonPriceLists() {
  return (
    <Stack spacing={1}>
      {[...Array(6)].map((_, index) => (
        <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center" key={index}>
          <Skeleton variant="circular" sx={{ width: 35, height: 35 }} />
          <Skeleton variant="rectangular" sx={{ width: 50, height: 15, borderRadius: 1 }} />
          <Skeleton variant="rectangular" sx={{ width: 50, height: 15, borderRadius: 1 }} />
        </Stack>
      ))}
    </Stack>
  );
}
