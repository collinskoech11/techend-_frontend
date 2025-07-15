import { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    Typography,
    TextField,
    Box,
    InputAdornment,
    Card,
    CircularProgress,
    IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import CurrencyBitcoinIcon from "@mui/icons-material/CurrencyBitcoin";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";

const accent = "#be1f2f";
const lightGray = "#f0f2f5";
const darkText = "#333"; // Assuming this from your landing page snippet
const lightText = "#666"; // Assuming this from your landing page snippet
const successColor = "#4CAF50";
const errorColor = "#F44336";

const AccentButton = styled(Button)(({ theme }) => ({
    backgroundColor: accent,
    color: "#fff",
    textTransform: "capitalize",
    padding: "12px 28px",
    borderRadius: "10px",
    fontWeight: 600,
    fontSize: "1rem",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    transition: "all 0.3s ease-in-out",
    "&:hover": {
        backgroundColor: "#a01624",
        boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
        transform: "translateY(-2px)",
    },
    "&:disabled": {
        backgroundColor: theme.palette.action.disabledBackground,
        color: theme.palette.action.disabled,
        boxShadow: "none",
    },
}));

interface SelectableCardProps {
    selected?: boolean;
}

// Renamed from SelectableCard to match the PricingCard style,
// but still includes the `selected` prop for dialog logic.
const PricingCardStyled = styled(Card, {
    shouldForwardProp: (prop) => prop !== 'selected',
})<SelectableCardProps>(({ theme, selected }) => ({
    textAlign: "center",
    padding: "40px 25px", // Matches landing page PricingCard padding
    borderRadius: "20px", // Matches landing page PricingCard borderRadius
    boxShadow: selected
        ? `0 15px 40px rgba(190, 31, 47, 0.2)` // Enhanced shadow for selected state
        : "0 8px 25px rgba(0,0,0,0.07)", // Matches landing page default shadow
    border: selected
        ? `2px solid ${accent}` // Accent border when selected
        : `1px solid ${lightGray}`, // Matches landing page default border
    height: "100%", // Ensures cards in a row have equal height
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between", // Distributes content top/bottom
    transition: "transform 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease", // Smooth transitions
    cursor: 'pointer', // Indicate it's clickable
    "&:hover": {
        transform: "translateY(-8px) scale(1.01)", // Matches landing page hover
        boxShadow: selected
            ? `0 20px 50px rgba(190, 31, 47, 0.3)` // Even stronger selected hover shadow
            : "0 12px 35px rgba(0,0,0,0.12)", // Matches landing page hover shadow
    },
}));


export default function PaymentDialog() {
    const [open, setOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState("");
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
    const [phone, setPhone] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvc, setCvc] = useState("");
    const [cryptoAddress, setCryptoAddress] = useState("");
    const [paymentStatus, setPaymentStatus] = useState("idle");

    const getCardType = () => {
        if (/^4/.test(cardNumber)) return "visa";
        if (/^5[1-5]/.test(cardNumber)) return "mastercard";
        if (/^3[47]/.test(cardNumber)) return "amex";
        if (/^6(?:011|5)/.test(cardNumber)) return "discover";
        return null;
    };

    const handleSimulatePayment = () => {
        setPaymentStatus("processing");
        setTimeout(() => {
            const isSuccess = Math.random() > 0.1;
            setPaymentStatus(isSuccess ? "success" : "error");

            if (isSuccess) {
                setTimeout(() => {
                    reset();
                }, 2000);
            }
        }, 2000);
    };

    const reset = () => {
        setPaymentStatus("idle");
        setPhone("");
        setCardNumber("");
        setExpiry("");
        setCvc("");
        setCryptoAddress("");
        setSelectedPaymentMethod("");
        setSelectedPlan("");
        setOpen(false);
    };

    const cardType = getCardType();

    return (
        <>
            <AccentButton onClick={() => setOpen(true)}>Make Payment</AccentButton>

            <Dialog open={open} onClose={reset} maxWidth="md" fullWidth>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1.5, borderBottom: '1px solid #eee' }}>
                    <Typography variant="h6" fontWeight={700}>
                        {paymentStatus === "success" ? "Payment Status" : "Select Your Plan & Payment Method"}
                    </Typography>
                    <IconButton onClick={reset} size="small" sx={{ color: (theme) => theme.palette.grey[500] }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ pt: 3, pb: 2, bgcolor: lightGray }}>
                    {paymentStatus === "success" && (
                        <Box sx={{ textAlign: "center", py: 4 }}>
                            <CheckCircleOutlineIcon sx={{ fontSize: 80, color: successColor, mb: 2 }} />
                            <Typography variant="h5" color={successColor} sx={{ fontWeight: 600, mb: 1 }}>
                                Payment Successful!
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Thank you for your purchase. Your plan is now active.
                            </Typography>
                        </Box>
                    )}

                    {paymentStatus === "error" && (
                        <Box sx={{ textAlign: "center", py: 4 }}>
                            <ErrorOutlineIcon sx={{ fontSize: 80, color: errorColor, mb: 2 }} />
                            <Typography variant="h5" color={errorColor} sx={{ fontWeight: 600, mb: 1 }}>
                                Payment Failed!
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                                There was an issue processing your payment. Please try again or use a different method.
                            </Typography>
                            <Button onClick={() => setPaymentStatus("idle")} variant="outlined" color="primary">
                                Try Again
                            </Button>
                        </Box>
                    )}

                    {paymentStatus === "idle" && (
                        <>
                            {!selectedPlan ? (
                                <>
                                    <Grid container spacing={3} justifyContent="center">
                                        {[
                                            { name: "Starter", price: "$15", unit: "/mo", description: "Ideal for getting your first store online.", features: ["Basic Store Setup", "Product Listings (up to 50)", "Standard Support"] },
                                            { name: "Growth", price: "$39", unit: "/mo", description: "For growing SMEs with inventory and marketing tools.", features: ["All Starter Features", "Unlimited Products", "Inventory Management", "Email Marketing Tools"] },
                                            { name: "Pro", price: "$79", unit: "/mo", description: "For established sellers with advanced needs and priority support.", features: ["All Growth Features", "Advanced Analytics", "Multi-User Access", "Priority Support"] },
                                            { name: "Marketplace", price: "5%", unit: "per sale", description: "No upfront fees, pay only a small commission on sales.", features: ["Basic Store Setup", "Product Listings (unlimited)", "Marketplace Visibility", "Standard Support"] },
                                        ].map((plan) => (
                                            <Grid item xs={12} sm={6} md={6} key={plan.name}>
                                                <PricingCardStyled
                                                    selected={selectedPlan === plan.name}
                                                    onClick={() => setSelectedPlan(plan.name)}
                                                >
                                                    <Box>
                                                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: accent }}>
                                                            {plan.name}
                                                        </Typography>
                                                        <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: darkText }}>
                                                            {plan.price}
                                                            <Typography component="span" variant="h6" color={lightText}>
                                                                {plan.unit}
                                                            </Typography>
                                                        </Typography>
                                                        <Typography color={lightText} sx={{ mb: 3 }}>
                                                            {plan.description}
                                                        </Typography>
                                                        <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left', margin: '0 auto 20px auto', maxWidth: '200px' }}>
                                                            {plan.features.map((feature, index) => (
                                                                <li key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                                                    <CheckCircleOutlineIcon sx={{ color: accent, mr: 1, fontSize: '1.2rem' }} />
                                                                    <Typography variant="body1" color={lightText}>{feature}</Typography>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </Box>
                                                </PricingCardStyled>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </>
                            ) : (
                                <>
                                    {/* <Typography variant="h6" sx={{ mb: 3, textAlign: 'center', color: 'text.primary' }}>
                                        Selected Plan:{" "}
                                        <strong style={{ color: accent }}>{selectedPlan}</strong>
                                    </Typography> */}

                                    {!selectedPaymentMethod ? (
                                        <>
                                            <Typography variant="body1" sx={{ mb: 3, color: 'text.primary', fontWeight: 500 }}>
                                                Select your payment method:
                                            </Typography>
                                            <Grid container spacing={2} justifyContent="center">
                                                {[
                                                    { id: "mpesa", name: "M-Pesa", icon: <PhoneAndroidIcon sx={{ fontSize: 50, color: accent }} /> },
                                                    { id: "card", name: "Card", icon: <CreditCardIcon sx={{ fontSize: 50, color: accent }} /> },
                                                    { id: "crypto", name: "Crypto", icon: <CurrencyBitcoinIcon sx={{ fontSize: 50, color: accent }} /> },
                                                ].map((method) => (
                                                    <Grid item xs={12} sm={4} key={method.id}>
                                                        <PricingCardStyled // Using PricingCardStyled for payment methods too
                                                            selected={selectedPaymentMethod === method.id}
                                                            onClick={() => setSelectedPaymentMethod(method.id)}
                                                        >
                                                            <Box sx={{ mb: 1 }}>{method.icon}</Box>
                                                            <Typography variant="subtitle1" fontWeight={600}>
                                                                {method.name}
                                                            </Typography>
                                                        </PricingCardStyled>
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        </>
                                    ) : (
                                        <>
                                            {/* <Typography variant="h6" sx={{ mb: 3, textAlign: 'center', color: 'text.primary' }}>
                                                You chose:{" "}
                                                <strong style={{ color: accent }}>
                                                    {selectedPaymentMethod === "mpesa" ? "M-Pesa" : selectedPaymentMethod === "card" ? "Card" : "Crypto"}
                                                </strong>
                                            </Typography> */}

                                            {selectedPaymentMethod === "mpesa" && (
                                                <Box sx={{ p: 2 }}>
                                                    <TextField
                                                        label="Phone Number (e.g., 2547XXXXXXXX)"
                                                        fullWidth
                                                        size="medium"
                                                        value={phone}
                                                        onChange={(e) => setPhone(e.target.value)}
                                                        margin="normal"
                                                        InputProps={{
                                                            startAdornment: <InputAdornment position="start">+ </InputAdornment>,
                                                        }}
                                                        sx={{ mb: 2 }}
                                                    />
                                                    <AccentButton
                                                        fullWidth
                                                        disabled={!phone || paymentStatus === 'idle'}
                                                        onClick={handleSimulatePayment}
                                                        startIcon={paymentStatus === 'idle' ? <CircularProgress size={20} color="inherit" /> : undefined}
                                                    >
                                                        {paymentStatus === 'idle' ? 'Processing...' : 'Pay Now'}
                                                    </AccentButton>
                                                </Box>
                                            )}

                                            {selectedPaymentMethod === "card" && (
                                                <Box sx={{ p: 2 }}>
                                                    <TextField
                                                        label="Card Number"
                                                        fullWidth
                                                        size="medium"
                                                        value={cardNumber}
                                                        onChange={(e) => setCardNumber(e.target.value)}
                                                        margin="normal"
                                                        sx={{ mb: 2 }}
                                                        InputProps={{
                                                            endAdornment: cardType && (
                                                                <InputAdornment position="end">
                                                                    <Image
                                                                        src={
                                                                            cardType === "visa"
                                                                                ? "https://www.citypng.com/public/uploads/preview/download-visa-card-logo-icon-png-735811696866915avdywnhoab.png"
                                                                                : cardType === "mastercard"
                                                                                    ? "https://www.citypng.com/public/uploads/preview/png-mastercard-payment-logo-icon-701751695036654sl5blladjo.png"
                                                                                    : ""
                                                                        }
                                                                        alt={cardType}
                                                                        width={80}
                                                                        height={50}
                                                                        style={{ objectFit: "contain" }}
                                                                    />
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    />

                                                    <Grid container spacing={2} sx={{ mb: 3 }}>
                                                        <Grid item xs={6}>
                                                            <TextField
                                                                label="Expiry Date (MM/YY)"
                                                                fullWidth
                                                                size="medium"
                                                                value={expiry}
                                                                onChange={(e) => setExpiry(e.target.value)}
                                                                placeholder="MM/YY"
                                                                inputProps={{ maxLength: 5 }}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <TextField
                                                                label="CVC"
                                                                fullWidth
                                                                size="medium"
                                                                value={cvc}
                                                                onChange={(e) => setCvc(e.target.value)}
                                                                inputProps={{ maxLength: 4 }}
                                                            />
                                                        </Grid>
                                                    </Grid>

                                                    <AccentButton
                                                        fullWidth
                                                        disabled={!cardNumber || !expiry || !cvc || paymentStatus === 'idle'}
                                                        onClick={handleSimulatePayment}
                                                        startIcon={paymentStatus === 'idle' ? <CircularProgress size={20} color="inherit" /> : undefined}
                                                    >
                                                        {paymentStatus === 'idle' ? 'Processing...' : 'Pay Now'}
                                                    </AccentButton>
                                                </Box>
                                            )}

                                            {selectedPaymentMethod === "crypto" && (
                                                <Box sx={{ p: 2 }}>
                                                    <TextField
                                                        label="Crypto Wallet Address"
                                                        fullWidth
                                                        size="medium"
                                                        value={cryptoAddress}
                                                        onChange={(e) => setCryptoAddress(e.target.value)}
                                                        margin="normal"
                                                        sx={{ mb: 2 }}
                                                    />
                                                    <AccentButton
                                                        fullWidth
                                                        disabled={!cryptoAddress || paymentStatus === 'idle'}
                                                        onClick={handleSimulatePayment}
                                                        startIcon={paymentStatus === 'idle' ? <CircularProgress size={20} color="inherit" /> : undefined}
                                                    >
                                                        {paymentStatus === 'idle' ? 'Processing...' : 'Pay Now'}
                                                    </AccentButton>
                                                </Box>
                                            )}
                                            <Box sx={{ textAlign: 'center', mt: 3 }}>
                                                <Button onClick={() => setSelectedPaymentMethod("")} color="secondary">
                                                    Back to Payment Methods
                                                </Button>
                                            </Box>
                                        </>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </DialogContent>

                {paymentStatus !== "success" && (
                    <DialogActions sx={{ p: 2, borderTop: '1px solid #eee' }}>
                        <Button onClick={reset} color="secondary">
                            Cancel
                        </Button>
                    </DialogActions>
                )}
            </Dialog>
        </>
    );
}