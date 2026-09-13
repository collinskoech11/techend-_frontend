import React, { useState, useRef } from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  Chip,
  alpha,
  useTheme,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import EditIcon from "@mui/icons-material/Edit";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

interface DocumentUploadZoneProps {
  label: string;
  helperText?: string;
  value: File | string | null;
  onChange: (file: File) => void;
  onRemove?: () => void;
  accept?: string;
  isAvatar?: boolean;
  required?: boolean;
}

export const DocumentUploadZone: React.FC<DocumentUploadZoneProps> = ({
  label,
  helperText,
  value,
  onChange,
  onRemove,
  accept = "image/*,application/pdf",
  isAvatar = false,
  required = false,
}) => {
  const theme = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Derive preview URL
  let previewUrl: string | null = null;
  let fileName: string = "";
  let isPdf = false;

  if (value instanceof File) {
    fileName = value.name;
    isPdf = value.type === "application/pdf" || value.name.endsWith(".pdf");
    if (!isPdf) {
      try {
        previewUrl = URL.createObjectURL(value);
      } catch (e) {
        previewUrl = null;
      }
    }
  } else if (typeof value === "string" && value.length > 0) {
    fileName = value.split("/").pop() || "Uploaded document";
    isPdf = value.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      previewUrl = value;
    }
  }

  const handleFile = (files: FileList | null) => {
    if (files && files.length > 0) {
      onChange(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files);
  };

  // Avatar / Logo layout
  if (isAvatar) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 3, p: 2.5, border: `1px dashed ${alpha(theme.palette.text.primary, 0.2)}`, borderRadius: "16px", bgcolor: alpha(theme.palette.background.paper, 0.6) }}>
        <input
          type="file"
          ref={fileInputRef}
          hidden
          accept={accept}
          onChange={(e) => handleFile(e.target.files)}
        />
        <Box
          onClick={() => fileInputRef.current?.click()}
          sx={{
            width: 84,
            height: 84,
            borderRadius: "50%",
            overflow: "hidden",
            bgcolor: alpha(theme.palette.primary.main, 0.08),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            border: `2px solid ${previewUrl ? theme.palette.primary.main : alpha(theme.palette.text.primary, 0.15)}`,
            position: "relative",
            flexShrink: 0,
            transition: "all 0.2s ease",
            "&:hover": {
              opacity: 0.85,
              borderColor: theme.palette.primary.main,
            },
          }}
        >
          {previewUrl ? (
            <Box
              component="img"
              src={previewUrl}
              alt="Logo Preview"
              sx={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <PhotoCameraIcon sx={{ fontSize: 34, color: theme.palette.primary.main }} />
          )}
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "text.primary" }}>
              {label}
            </Typography>
            {required && (
              <Chip label="Required" size="small" color="primary" variant="outlined" sx={{ height: 20, fontSize: "10px", fontWeight: 700 }} />
            )}
            {previewUrl && (
              <Chip icon={<CheckCircleIcon sx={{ fontSize: "14px !important" }} />} label="Uploaded" size="small" color="success" sx={{ height: 20, fontSize: "10px", fontWeight: 700 }} />
            )}
          </Box>
          <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mb: 1.5 }}>
            {helperText || "Upload a crisp square logo (PNG, JPG, SVG). Max 5MB."}
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              size="small"
              variant="outlined"
              startIcon={<EditIcon sx={{ fontSize: 16 }} />}
              onClick={() => fileInputRef.current?.click()}
              sx={{ borderRadius: "8px", textTransform: "none", fontSize: "12px", fontWeight: 600 }}
            >
              {value ? "Change Logo" : "Upload Logo"}
            </Button>
            {value && onRemove && (
              <Button
                size="small"
                color="error"
                startIcon={<DeleteOutlineIcon sx={{ fontSize: 16 }} />}
                onClick={onRemove}
                sx={{ borderRadius: "8px", textTransform: "none", fontSize: "12px", fontWeight: 600 }}
              >
                Remove
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    );
  }

  // Standard Document Card
  const hasFile = Boolean(value);

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.8 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "text.primary" }}>
          {label} {required && <span style={{ color: theme.palette.error.main }}>*</span>}
        </Typography>
        {hasFile && (
          <Chip
            icon={<CheckCircleIcon sx={{ fontSize: "14px !important" }} />}
            label="Ready"
            size="small"
            color="success"
            sx={{ height: 22, fontSize: "11px", fontWeight: 700 }}
          />
        )}
      </Box>

      {helperText && (
        <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mb: 1.2 }}>
          {helperText}
        </Typography>
      )}

      <input
        type="file"
        ref={fileInputRef}
        hidden
        accept={accept}
        onChange={(e) => handleFile(e.target.files)}
      />

      <Box
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !hasFile && fileInputRef.current?.click()}
        sx={{
          border: `2px dashed ${
            isDragging
              ? theme.palette.primary.main
              : hasFile
              ? alpha(theme.palette.success.main, 0.45)
              : alpha(theme.palette.text.primary, 0.18)
          }`,
          borderRadius: "16px",
          bgcolor: isDragging
            ? alpha(theme.palette.primary.main, 0.05)
            : hasFile
            ? alpha(theme.palette.success.main, 0.03)
            : alpha(theme.palette.background.paper, 0.6),
          p: 2.2,
          textAlign: "center",
          cursor: hasFile ? "default" : "pointer",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            borderColor: hasFile ? alpha(theme.palette.success.main, 0.7) : theme.palette.primary.main,
            bgcolor: alpha(theme.palette.primary.main, 0.02),
          },
        }}
      >
        {hasFile ? (
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, minWidth: 0 }}>
              {previewUrl ? (
                <Box
                  component="img"
                  src={previewUrl}
                  alt="Preview"
                  sx={{
                    width: 58,
                    height: 58,
                    borderRadius: "10px",
                    objectFit: "cover",
                    border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
                    flexShrink: 0,
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: 58,
                    height: 58,
                    borderRadius: "10px",
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <InsertDriveFileIcon sx={{ color: theme.palette.primary.main, fontSize: 32 }} />
                </Box>
              )}

              <Box sx={{ textAlign: "left", minWidth: 0 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    color: "text.primary",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: { xs: 150, sm: 260 },
                  }}
                >
                  {fileName}
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  {isPdf ? "PDF Document" : "Image File"} • Attached
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button
                size="small"
                variant="outlined"
                startIcon={<EditIcon sx={{ fontSize: 14 }} />}
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                sx={{
                  borderRadius: "8px",
                  fontSize: "12px",
                  textTransform: "none",
                  fontWeight: 600,
                  px: 1.5,
                }}
              >
                Change
              </Button>
              {onRemove && (
                <IconButton
                  size="small"
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove();
                  }}
                  sx={{ borderRadius: "8px", p: 0.8 }}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          </Box>
        ) : (
          <Box sx={{ py: 1.5 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                bgcolor: alpha(theme.palette.primary.main, 0.08),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 10px",
                color: theme.palette.primary.main,
              }}
            >
              <CloudUploadIcon fontSize="medium" />
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 700, color: "text.primary", mb: 0.5 }}>
              Click to browse or drag & drop file
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              PNG, JPG, WEBP, or PDF (up to 10MB)
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default DocumentUploadZone;
