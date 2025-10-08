import React, { useState, useRef, useEffect } from "react";

const API_BASE = "http://localhost:3001";

function App() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionStatus, setSessionStatus] = useState("ready");
  const [showQuickActions, setShowQuickActions] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const [connectionStatus, setConnectionStatus] = useState("connected");
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("1");
  const [sessionId, setSessionId] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [generationStatus, setGenerationStatus] = useState("idle");
  const [strategyDoc, setStrategyDoc] = useState(null);

  // const strategyDoc = {
  //   content: {
  //     campaign_strategy: {
  //       campaign_summary:
  //         "The strategy focuses on leveraging brand excitement to announce the launch of a new, limited-time offer, encouraging repeat purchases among existing customers.",
  //       primary_objective:
  //         "Encourage repeat purchases by introducing a new Limited Edition Pack.",
  //       target_segment:
  //         "Customers engaged within the last 180 days, familiar with the brand, and active.",
  //       key_messaging:
  //         "Scarcity and urgency drive purchases of the limited-time Fall Pack.",
  //       blocks: [
  //         {
  //           order: 1,
  //           block_type: "header",
  //           indicative_content:
  //             "Brand header featuring our logo with navigation to New Products, Best Sellers, and Offers.",
  //           redirection_url: "https://www.brandhomepage.com",
  //         },
  //         {
  //           order: 2,
  //           block_type: "hero_image",
  //           indicative_content:
  //             "Vibrant image of the Limited Edition Fall Pack with headline: 'Grab the Fall Pack Before It's Gone!'",
  //           redirection_url: "https://www.brandhomepage.com/fall-pack",
  //         },
  //         {
  //           order: 3,
  //           block_type: "product_push",
  //           indicative_content:
  //             "Spotlighting the Fall Pack with images, a brief description emphasizing its unique flavors and limited availability.",
  //           redirection_url: "https://www.brandhomepage.com/fall-pack",
  //         },
  //         {
  //           order: 4,
  //           block_type: "sale_block",
  //           indicative_content:
  //             "Highlight of an exclusive offer on the Fall Pack, including a 15% discount for returning customers. Use code FALL15.",
  //           redirection_url: "https://www.brandhomepage.com/sale",
  //         },
  //         {
  //           order: 5,
  //           block_type: "product_review_block",
  //           indicative_content:
  //             "Testimonials praising previous limited editions, fostering trust and excitement for the new pack.",
  //           redirection_url: "https://www.brandhomepage.com/reviews/fall-pack",
  //         },
  //         {
  //           order: 6,
  //           block_type: "footer",
  //           indicative_content:
  //             "Standard footer with links to unsubscribe, contact info, privacy policy, and social media profiles.",
  //           redirection_url: null,
  //         },
  //       ],
  //     },
  //   },
  //   strategy_doc_id: 10,
  //   version: 8,
  // };

  const lastIdRef = useRef("");

  const generateId = () => {
    // Get timestamp in milliseconds for uniqueness
    let timestamp = Date.now();

    // Add small random component (0-999) for extra collision protection
    const random = Math.floor(Math.random() * 1000);

    // Combine timestamp and random, convert to base-36 (0-9, a-z)
    const id = (timestamp * 1000 + random).toString(36);

    // Ensure we never return duplicate ID (extremely rare but possible)
    if (id === lastIdRef.current) {
      // If somehow duplicate, recursively call until unique
      return generateId();
    }

    lastIdRef.current = id;
    return id;
  };

  const quickActions = [
    "Show me the top 3 performing campaigns",
    "Compare open rates across all campaigns",
    "Create an email calendar for next month",
    "Which campaigns had the lowest unsubscribe rates?",
    "Generate a performance summary report",
  ];

  const styles = {
    container: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0.75rem",
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    chatContainer: {
      width: "100%",
      maxWidth: "1400px",
      height: "95vh",
      backgroundColor: "white",
      borderRadius: "16px",
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      border: "1px solid #e2e8f0",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    },
    mainContent: {
      display: "flex",
      flex: 1,
      overflow: "hidden",
      position: "relative",
    },
    leftSection: {
      width: "30%",
      borderRight: "1px solid #e2e8f0",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    },

    middleSection: {
      width: "70%",
      borderRight: "1px solid #e2e8f0",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    },

    rightSection: {
      width: "30%",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    },

    sectionHeader: {
      padding: "1rem 1.5rem",
      borderBottom: "1px solid #e2e8f0",
      backgroundColor: "#f8fafc",
    },

    sectionTitle: {
      fontSize: "0.9rem",
      fontWeight: "600",
      color: "#1e293b",
      margin: 0,
    },

    sectionContent: {
      flex: 1,
      overflowY: "auto",
      padding: "1rem",
    },
    header: {
      background: "linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)",
      color: "#64748b",
      padding: "1rem 1.5rem",
      borderBottom: "1px solid #e2e8f0",
    },
    headerContent: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    headerLeft: {
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
    },
    icon: {
      width: "32px",
      height: "32px",
      backgroundColor: "rgba(139, 92, 246, 0.1)",
      borderRadius: "6px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
    },
    title: {
      fontSize: "1.1rem",
      fontWeight: "600",
      margin: 0,
      color: "#1e293b",
    },
    subtitle: {
      color: "#64748b",
      fontSize: "0.8rem",
      margin: 0,
    },
    headerRight: {
      display: "flex",
      alignItems: "center",
      gap: "1rem",
    },
    statusIndicator: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    },
    statusDot: {
      width: "8px",
      height: "8px",
      borderRadius: "50%",
      backgroundColor: connectionStatus === "connected" ? "#86efac" : "#fca5a5",
    },
    newChatButton: {
      backgroundColor: "rgba(139, 92, 246, 0.1)",
      border: "1px solid rgba(139, 92, 246, 0.2)",
      color: "#6b46c1",
      padding: "0.4rem 0.8rem",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "0.8rem",
      fontWeight: "500",
      transition: "background-color 0.2s",
    },
    messagesArea: {
      flex: 1,
      overflowY: "auto",
      background: "rgba(248, 250, 252, 0.3)",
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
    },
    messageContainer: {
      display: "flex",
      gap: "0.6rem",
    },
    userMessageContainer: {
      justifyContent: "flex-end",
    },
    assistantMessageContainer: {
      justifyContent: "flex-start",
    },
    avatar: {
      width: "28px",
      height: "28px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "0.7rem",
      fontWeight: "500",
      flexShrink: 0,
    },
    userAvatar: {
      background: "linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)",
      color: "#6b46c1",
      border: "1px solid rgba(139, 92, 246, 0.2)",
    },
    assistantAvatar: {
      backgroundColor: "white",
      color: "#64748b",
      border: "1px solid #e2e8f0",
      padding: "2px",
      overflow: "hidden",
    },
    messageContent: {
      maxWidth: "75%",
      display: "flex",
      flexDirection: "column",
    },
    messageBubble: {
      padding: "0.8rem 1rem",
      borderRadius: "12px",
      fontSize: "0.8rem",
      lineHeight: "1.4",
      wordWrap: "break-word",
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    },
    userMessage: {
      background: "linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)",
      color: "#6b46c1",
      border: "1px solid rgba(139, 92, 246, 0.2)",
    },
    assistantMessage: {
      backgroundColor: "white",
      color: "#1e293b",
      border: "1px solid #e2e8f0",
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    },
    errorMessage: {
      backgroundColor: "#fef2f2",
      color: "#dc2626",
      border: "1px solid #fecaca",
    },
    timestamp: {
      fontSize: "0.65rem",
      color: "#64748b",
      marginTop: "0.3rem",
    },
    userTimestamp: {
      textAlign: "right",
    },
    suggestions: {
      marginTop: "0.6rem",
      display: "flex",
      flexDirection: "column",
      gap: "0.4rem",
    },
    suggestionButton: {
      padding: "0.6rem",
      backgroundColor: "white",
      border: "1px solid #e2e8f0",
      borderRadius: "6px",
      textAlign: "left",
      cursor: "pointer",
      fontSize: "0.75rem",
      transition: "all 0.2s",
    },
    typingIndicator: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      padding: "0.8rem 1rem",
      backgroundColor: "white",
      border: "1px solid #e2e8f0",
      borderRadius: "12px",
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    },
    spinner: {
      width: "16px",
      height: "16px",
      border: "2px solid #e2e8f0",
      borderTop: "2px solid #4f46e5",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    },
    calendarGrid: {
      marginTop: "0.8rem",
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
      gap: "1rem",
    },
    calendarCard: {
      backgroundColor: "#f8fafc",
      border: "1px solid #e2e8f0",
      borderRadius: "10px",
      padding: "0.9rem",
      transition: "all 0.2s",
      position: "relative",
      minHeight: "100px",
    },
    generateButton: {
      position: "absolute",
      bottom: "0.6rem",
      right: "0.6rem",
      width: "26px",
      height: "26px",
      backgroundColor: "#4f46e5",
      border: "none",
      borderRadius: "50%",
      color: "white",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "0.75rem",
      fontWeight: "bold",
      transition: "all 0.2s",
      opacity: 0.9,
      boxShadow: "0 2px 6px rgba(79, 70, 229, 0.3)",
    },
    cardHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "0.6rem",
      gap: "0.5rem",
    },
    cardTitle: {
      fontSize: "0.85rem",
      fontWeight: "600",
      color: "#1e293b",
      margin: 0,
      lineHeight: "1.3",
      flex: 1,
      minWidth: 0,
      wordBreak: "break-word",
      hyphens: "auto",
    },
    cardDate: {
      fontSize: "0.7rem",
      color: "#64748b",
      fontWeight: "500",
    },
    cardType: {
      fontSize: "0.65rem",
      padding: "0.2rem 0.5rem",
      borderRadius: "12px",
      fontWeight: "500",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    cardContent: {
      marginTop: "0.6rem",
      paddingBottom: "1.2rem",
    },
    cardSubject: {
      fontSize: "0.8rem",
      color: "#374151",
      fontWeight: "500",
      marginBottom: "0.4rem",
      lineHeight: "1.3",
    },
    cardPreview: {
      fontSize: "0.75rem",
      color: "#6b7280",
      lineHeight: "1.4",
      marginBottom: "0.3rem",
    },
    inputArea: {
      borderTop: "1px solid #e2e8f0",
      backgroundColor: "white",
      padding: "1rem",
    },
    quickActionsContainer: {
      marginBottom: "0.8rem",
    },
    quickActionsTitle: {
      fontSize: "0.75rem",
      color: "#64748b",
      fontWeight: "500",
      marginBottom: "0.4rem",
    },
    quickActionsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "0.4rem",
    },
    quickActionButton: {
      textAlign: "left",
      padding: "0.6rem",
      fontSize: "0.75rem",
      backgroundColor: "#f8fafc",
      border: "1px solid #e2e8f0",
      borderRadius: "6px",
      cursor: "pointer",
      transition: "all 0.2s",
    },
    inputForm: {
      display: "flex",
      alignItems: "end",
      gap: "0.8rem",
    },
    quickActionToggle: {
      width: "36px",
      height: "36px",
      backgroundColor: "#f1f5f9",
      border: "none",
      borderRadius: "6px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      transition: "background-color 0.2s",
      flexShrink: 0,
    },
    textareaContainer: {
      flex: 1,
      position: "relative",
    },
    textarea: {
      width: "100%",
      padding: "0.6rem 0.8rem",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      fontSize: "0.8rem",
      resize: "none",
      minHeight: "40px",
      maxHeight: "100px",
      outline: "none",
      fontFamily: "inherit",
      transition: "border-color 0.2s, box-shadow 0.2s",
    },
    sendButton: {
      width: "40px",
      height: "40px",
      backgroundColor: "#4f46e5",
      border: "none",
      borderRadius: "8px",
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      transition: "background-color 0.2s",
      flexShrink: 0,
    },
    sendButtonDisabled: {
      backgroundColor: "#d1d5db",
      cursor: "not-allowed",
    },
    helpText: {
      fontSize: "0.65rem",
      color: "#64748b",
      textAlign: "center",
      marginTop: "0.4rem",
    },
    overlay: {
      position: "absolute",
      top: 0,
      right: 0,
      width: "30%",
      height: "100%",
      backgroundColor: "white",
      borderLeft: "1px solid #e2e8f0",
      boxShadow: "-2px 0 10px rgba(0, 0, 0, 0.1)",
      zIndex: 100,
      display: "flex",
      flexDirection: "column",
      animation: "slideInRight 0.3s ease-out",
    },
    overlayHeader: {
      padding: "1rem 1.5rem",
      borderBottom: "1px solid #e2e8f0",
      backgroundColor: "#f8fafc",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    overlayTitle: {
      fontSize: "0.9rem",
      fontWeight: "600",
      color: "#1e293b",
      margin: 0,
    },
    closeButton: {
      width: "28px",
      height: "28px",
      border: "none",
      borderRadius: "6px",
      backgroundColor: "#f1f5f9",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "background-color 0.2s",
    },
    overlayContent: {
      flex: 1,
      padding: "1rem",
      overflowY: "auto",
      backgroundColor: "white",
    },
  };

  const getCardTypeStyle = (type) => {
    const lowerType = type?.toLowerCase() || "";
    if (lowerType.includes("sale") || lowerType.includes("promo")) {
      return { backgroundColor: "#fef3c7", color: "#92400e" };
    } else if (
      lowerType.includes("newsletter") ||
      lowerType.includes("education")
    ) {
      return { backgroundColor: "#dbeafe", color: "#1e40af" };
    } else if (lowerType.includes("launch") || lowerType.includes("product")) {
      return { backgroundColor: "#d1fae5", color: "#065f46" };
    } else {
      return { backgroundColor: "#f3e8ff", color: "#6b21a8" };
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    fetchBrands();
    initializeSession();
    checkConnection();
  }, []);

  useEffect(() => {
    if (brands.length > 0 && !sessionId) {
      initializeSession(selectedBrand);
    }
  }, [brands]);

  const checkConnection = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/health`);
      if (response.ok) {
        setConnectionStatus("connected");
      } else {
        setConnectionStatus("disconnected");
      }
    } catch (error) {
      setConnectionStatus("disconnected");
    }
  };

  const initializeSession = async (brandKey = selectedBrand) => {
    try {
      const response = await fetch(`${API_BASE}/api/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brandKey }),
      });
      const data = await response.json();

      if (data.sessionId) {
        setSessionId(data.sessionId);
        setSessionStatus(data.status);

        setMessages([
          {
            type: "assistant",
            content: data.greeting,
            timestamp: new Date(),
            suggestions: quickActions.slice(0, 3),
          },
        ]);
      }
    } catch (error) {
      console.error("Failed to initialize session:", error);
      setSessionStatus("error");
      setConnectionStatus("disconnected");
      setMessages([
        {
          type: "assistant",
          content:
            "I'm having trouble connecting to the analytics engine. Please check that the backend server is running on port 3001.",
          timestamp: new Date(),
          isError: true,
        },
      ]);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/brands`);
      const data = await response.json();
      setBrands(data.brands);
    } catch (error) {
      console.error("Failed to fetch brands:", error);
    }
  };

  const handleBrandChange = async (brandKey) => {
    setSelectedBrand(brandKey);
    setMessages([]);
    await initializeSession(brandKey);
  };

  const parseCalendarData = (content) => {
    // Check if this is a clarifying question (before calendar generation)
    const isQuestion = content.includes("?");

    try {
      const jsonMatch =
        content.match(/```json\s*([\s\S]*?)\s*```/) ||
        content.match(/\{[\s\S]*"campaigns"[\s\S]*\}/);

      if (jsonMatch) {
        const jsonStr = jsonMatch[1] || jsonMatch[0];
        const data = JSON.parse(jsonStr);

        const calendarId = generateId();

        const campaignsWithIds = (data.campaigns || data).map((campaign) => ({
          ...campaign,
          campaign_id: generateId(),
          calendar_id: calendarId,
        }));

        return {
          campaigns: campaignsWithIds,
          hasCalendar: true,
          calendarId: calendarId,
          isQuestion: false,
        };
      }
      return { isQuestion }; // Return whether it's a question
    } catch (error) {
      console.error("Failed to parse calendar JSON:", error);
      return { isQuestion };
    }
  };

  const cleanContentForCalendar = (content) => {
    // Remove JSON code blocks if calendar data is present
    let cleanContent = content.replace(/```json\s*[\s\S]*?\s*```/g, "");
    // Remove standalone JSON objects
    cleanContent = cleanContent.replace(/\{[\s\S]*"campaigns"[\s\S]*\}/g, "");
    // Clean up extra whitespace and newlines
    cleanContent = cleanContent.replace(/\n\s*\n\s*\n/g, "\n\n").trim();
    return cleanContent;
  };

  const sendCalendarToAPI = async (campaigns, calendarId, brandId) => {
    try {
      const url = `https://zip.retainiq.io/strategydoc/brands/${brandId}/calendars/bulk/`;

      const payload = {
        calender_id: calendarId,
        campaigns: campaigns,
      };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`);
      }

      const result = await response.json();
      console.log("Calendar data sent successfully:", result);
      return result;
    } catch (error) {
      console.error("Failed to send calendar data to API:", error);
      throw error;
    }
  };

  const generateCampaignContent = async (campaign) => {
    setSelectedCampaign(campaign);
    setStrategyDoc(null);
    setShowOverlay(true);
    setGenerationStatus("loading");

    if (!campaign.calendar_id) {
      console.error("Calendar ID not found in campaign");
      setGenerationStatus("error");
      return;
    }

    try {
      const url = `https://zip.retainiq.io/strategydoc/brands/${selectedBrand}/calendars/${campaign.calendar_id}/campaigns/${campaign.campaign_id}/generate/`;

      console.log("Calling generate API:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`);
      }

      const result = await response.json();
      console.log("Generate API response:", result);
      setGenerationStatus("success");
      setStrategyDoc(result);
    } catch (error) {
      console.error("Failed to generate campaign content:", error);
      setGenerationStatus("error");
    }
  };
  const renderCalendarCards = (campaigns) => {
    console.log(campaigns);
    if (!Array.isArray(campaigns)) return null;

    return (
      <div style={styles.calendarGrid}>
        {campaigns.map((campaign) => (
          <div
            key={campaign.campaign_id}
            style={styles.calendarCard}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
              const generateBtn =
                e.currentTarget.querySelector(".generate-btn");
              if (generateBtn) generateBtn.style.opacity = "1";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
              const generateBtn =
                e.currentTarget.querySelector(".generate-btn");
              if (generateBtn) generateBtn.style.opacity = "0.8";
            }}
          >
            <button
              className="generate-btn"
              style={styles.generateButton}
              onClick={() => generateCampaignContent(campaign)}
              title="Generate content for this campaign"
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "#4338ca";
                e.target.style.transform = "scale(1.1)";
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "#4f46e5";
                e.target.style.transform = "scale(1)";
              }}
            >
              ✨
            </button>
            <div style={styles.cardHeader}>
              <h4 style={styles.cardTitle}>
                {campaign.campaign_name || campaign.name}
              </h4>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: "0.3rem",
                  flexShrink: 0,
                }}
              >
                <span style={styles.cardDate}>
                  {campaign.planned_date || campaign.date || campaign.send_date}
                </span>
                <span
                  style={{
                    ...styles.cardType,
                    ...getCardTypeStyle(campaign.email_type || campaign.type),
                  }}
                >
                  {campaign.email_type || campaign.type || "Email"}
                </span>
              </div>
            </div>
            <div style={styles.cardContent}>
              <div style={styles.cardSubject}>
                📧 {campaign.subject_line || campaign.subject}
              </div>
              {(campaign.preview_text || campaign.preview) && (
                <div style={styles.cardPreview}>
                  {campaign.preview_text || campaign.preview}
                </div>
              )}
              {campaign.planned_time && (
                <div
                  style={{
                    fontSize: "0.7rem",
                    color: "#9ca3af",
                    marginTop: "0.2rem",
                  }}
                >
                  ⏰ {campaign.planned_time}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const sendMessage = async (messageText = null) => {
    const textToSend = messageText || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    const userMessage = {
      type: "user",
      content: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    setIsTyping(true);
    setShowQuickActions(false);

    try {
      const response = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, message: textToSend }),
      });

      const data = await response.json();

      await new Promise((resolve) => setTimeout(resolve, 800));

      if (data.status === "success") {
        const calendarData = parseCalendarData(data.response);

        const displayContent = calendarData?.hasCalendar
          ? cleanContentForCalendar(data.response)
          : data.response;

        if (calendarData?.hasCalendar && calendarData?.campaigns) {
          sendCalendarToAPI(
            calendarData.campaigns,
            calendarData.calendarId,
            selectedBrand
          )
            .then(() => {
              console.log("Calendar synced to API");
            })
            .catch((error) => {
              console.error("Failed to sync calendar:", error);
            });
        }

        setMessages((prev) => [
          ...prev,
          {
            type: "assistant",
            content: displayContent,
            timestamp: new Date(),
            calendarData: calendarData?.campaigns || null,
            calendarId: calendarData?.calendarId || null,
            isQuestion: calendarData?.isQuestion || false, // Add this flag
          },
        ]);
        setConnectionStatus("connected");
      } else {
        throw new Error(data.error || "Unknown error");
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          type: "assistant",
          content:
            "I encountered an issue processing your request. Please try again or rephrase your question.",
          timestamp: new Date(),
          isError: true,
        },
      ]);
      setConnectionStatus("disconnected");
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const resetChat = async () => {
    try {
      if (sessionId) {
        await fetch(`${API_BASE}/api/reset`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
      }
      setMessages([]);
      initializeSession();
    } catch (error) {
      console.error("Failed to reset chat:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatMessage = (content) => {
    return content.split("\n").map((line, index) => {
      // Replace **text** with bold formatting
      const formattedLine = line.replace(
        /\*\*(.*?)\*\*/g,
        "<strong>$1</strong>"
      );

      return (
        <React.Fragment key={index}>
          <span dangerouslySetInnerHTML={{ __html: formattedLine }}></span>
          {index < content.split("\n").length - 1 && <br />}
        </React.Fragment>
      );
    });
  };

  const formatTimestamp = (timestamp) => {
    return timestamp.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

             @keyframes slideIn {
      from {
        transform: translateX(100%);
      }
      to {
        transform: translateX(0);
      }
    }
        `}
      </style>

      <div style={styles.chatContainer}>
        {/* Header */}
        <header style={styles.header}>
          <div style={styles.headerContent}>
            <div style={styles.headerLeft}>
              <div style={styles.icon}>
                <img
                  src="/zipsense-logo.png"
                  alt="Zipsense Logo"
                  style={{
                    width: "24px",
                    height: "24px",
                    objectFit: "contain",
                  }}
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "block";
                  }}
                />
                <svg
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  style={{ display: "none" }}
                >
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 style={styles.title}>Zipsense AI Strategist</h1>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginTop: "4px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.8rem",
                      color: "#64748b",
                      fontWeight: "500",
                    }}
                  >
                    Brand:
                  </span>
                  <select
                    value={selectedBrand}
                    onChange={(e) => handleBrandChange(e.target.value)}
                    style={{
                      fontSize: "0.8rem",
                      padding: "0.35rem 0.75rem",
                      paddingRight: "2rem",
                      border: "1px solid #e2e8f0",
                      borderRadius: "6px",
                      backgroundColor: "white",
                      cursor: "pointer",
                      outline: "none",
                      fontWeight: "500",
                      color: "#1e293b",
                      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                      transition: "all 0.2s",
                      appearance: "none",
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2364748b' d='M6 8L2 4h8z'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 0.5rem center",
                    }}
                    onMouseOver={(e) => {
                      e.target.style.borderColor = "#c7d2fe";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(139, 92, 246, 0.1)";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.borderColor = "#e2e8f0";
                      e.target.style.boxShadow =
                        "0 1px 2px rgba(0, 0, 0, 0.05)";
                    }}
                  >
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div style={styles.headerRight}>
              <div style={styles.statusIndicator}>
                <div style={styles.statusDot}></div>
                <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
                  {connectionStatus === "connected"
                    ? "Connected"
                    : "Disconnected"}
                </span>
              </div>

              <button
                onClick={resetChat}
                style={styles.newChatButton}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "rgba(139, 92, 246, 0.2)")
                }
                onMouseOut={(e) =>
                  (e.target.style.backgroundColor = "rgba(139, 92, 246, 0.1)")
                }
              >
                New Chat
              </button>
            </div>
          </div>
        </header>

        {/* Messages Area */}
        <div style={styles.mainContent}>
          {/* Left Section - Chat */}
          <div style={styles.leftSection}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Chat</h2>
            </div>
            <div
              style={{
                ...styles.sectionContent,
                padding: "1rem",
                background: "rgba(248, 250, 252, 0.3)",
              }}
            >
              <div style={styles.messagesArea}>
                {messages.map((message, index) => {
                  const isWelcomeMessage =
                    message.type === "assistant" && index === 0;

                  const shouldShowInChat =
                    message.type === "user" ||
                    isWelcomeMessage ||
                    (message.type === "assistant" && message.isQuestion); // Show questions in chat

                  if (!shouldShowInChat) return null;

                  return (
                    <div
                      key={index}
                      style={{
                        ...styles.messageContainer,
                        ...(message.type === "user"
                          ? styles.userMessageContainer
                          : styles.assistantMessageContainer),
                      }}
                    >
                      {/* Avatar */}
                      <div
                        style={{
                          ...styles.avatar,
                          ...(message.type === "user"
                            ? styles.userAvatar
                            : styles.assistantAvatar),
                          order: message.type === "user" ? 2 : 1,
                        }}
                      >
                        {message.type === "user" ? (
                          "You"
                        ) : (
                          <img
                            src="/zipsense-logo.png"
                            alt="Zipsense AI"
                            style={{
                              width: "20px",
                              height: "20px",
                              objectFit: "contain",
                            }}
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "block";
                            }}
                          />
                        )}
                        {message.type === "assistant" && (
                          <span style={{ display: "none", fontSize: "0.7rem" }}>
                            AI
                          </span>
                        )}
                      </div>

                      {/* Message Content */}
                      <div
                        style={{
                          ...styles.messageContent,
                          order: message.type === "user" ? 1 : 2,
                        }}
                      >
                        {/* Message bubble */}
                        <div
                          style={{
                            ...styles.messageBubble,
                            ...(message.type === "user"
                              ? styles.userMessage
                              : message.isError
                              ? styles.errorMessage
                              : styles.assistantMessage),
                          }}
                        >
                          <div>{formatMessage(message.content)}</div>
                        </div>

                        {/* Suggestions - only for welcome message */}
                        {message.suggestions && isWelcomeMessage && (
                          <div style={styles.suggestions}>
                            {message.suggestions.map((suggestion, idx) => (
                              <button
                                key={idx}
                                onClick={() => sendMessage(suggestion)}
                                style={styles.suggestionButton}
                                onMouseOver={(e) => {
                                  e.target.style.backgroundColor = "#f8fafc";
                                  e.target.style.borderColor = "#4f46e5";
                                }}
                                onMouseOut={(e) => {
                                  e.target.style.backgroundColor = "white";
                                  e.target.style.borderColor = "#e2e8f0";
                                }}
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Timestamp */}
                        <div
                          style={{
                            ...styles.timestamp,
                            ...(message.type === "user"
                              ? styles.userTimestamp
                              : {}),
                          }}
                        >
                          {formatTimestamp(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area - Moved inside left section */}
            <div style={styles.inputArea}>
              {/* Quick Actions */}
              {showQuickActions && (
                <div style={styles.quickActionsContainer}>
                  <div style={styles.quickActionsTitle}>Quick Actions:</div>
                  <div style={styles.quickActionsGrid}>
                    {quickActions.map((action, index) => (
                      <button
                        key={index}
                        onClick={() => sendMessage(action)}
                        style={styles.quickActionButton}
                        onMouseOver={(e) => {
                          e.target.style.backgroundColor = "#f0f9ff";
                          e.target.style.borderColor = "#4f46e5";
                        }}
                        onMouseOut={(e) => {
                          e.target.style.backgroundColor = "#f8fafc";
                          e.target.style.borderColor = "#e2e8f0";
                        }}
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input form */}
              <div style={styles.inputForm}>
                <button
                  onClick={() => setShowQuickActions(!showQuickActions)}
                  style={styles.quickActionToggle}
                  onMouseOver={(e) =>
                    (e.target.style.backgroundColor = "#e2e8f0")
                  }
                  onMouseOut={(e) =>
                    (e.target.style.backgroundColor = "#f1f5f9")
                  }
                  title="Quick Actions"
                >
                  <svg
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </button>

                <div style={styles.textareaContainer}>
                  <textarea
                    ref={textareaRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about campaign performance..."
                    style={styles.textarea}
                    disabled={isLoading}
                    rows={1}
                    onFocus={(e) => (e.target.style.borderColor = "#4f46e5")}
                    onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
                  />
                </div>

                <button
                  onClick={() => sendMessage()}
                  disabled={isLoading || !inputMessage.trim()}
                  style={{
                    ...styles.sendButton,
                    ...(isLoading || !inputMessage.trim()
                      ? styles.sendButtonDisabled
                      : {}),
                    ...(!isLoading && inputMessage.trim()
                      ? {}
                      : { cursor: "not-allowed" }),
                  }}
                  onMouseOver={(e) => {
                    if (!isLoading && inputMessage.trim()) {
                      e.target.style.backgroundColor = "#4338ca";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isLoading && inputMessage.trim()) {
                      e.target.style.backgroundColor = "#4f46e5";
                    }
                  }}
                >
                  {isLoading ? (
                    <div style={styles.spinner}></div>
                  ) : (
                    <svg
                      width="18"
                      height="18"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  )}
                </button>
              </div>

              <div style={styles.helpText}>
                Press Enter to send • Shift+Enter for new line
              </div>
            </div>
          </div>

          {/* Middle Section - Output */}
          <div style={styles.middleSection}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Output</h2>
            </div>
            <div
              style={{
                ...styles.sectionContent,
                background: "rgba(248, 250, 252, 0.3)",
              }}
            >
              {messages.map((message, index) => {
                const isWelcomeMessage = index === 0;

                const shouldShowInOutput =
                  message.type === "assistant" &&
                  !isWelcomeMessage &&
                  !message.isQuestion; // Don't show questions in output

                if (!shouldShowInOutput) return null;

                return (
                  <div key={index} style={{ marginBottom: "1rem" }}>
                    <div
                      style={{
                        ...styles.messageContainer,
                        ...styles.assistantMessageContainer,
                      }}
                    >
                      {/* Avatar */}
                      <div
                        style={{
                          ...styles.avatar,
                          ...styles.assistantAvatar,
                          order: 1,
                        }}
                      >
                        <img
                          src="/zipsense-logo.png"
                          alt="Zipsense AI"
                          style={{
                            width: "20px",
                            height: "20px",
                            objectFit: "contain",
                          }}
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "block";
                          }}
                        />
                        <span style={{ display: "none", fontSize: "0.7rem" }}>
                          AI
                        </span>
                      </div>

                      {/* Message Content */}
                      <div
                        style={{
                          ...styles.messageContent,
                          order: 2,
                        }}
                      >
                        {/* Message bubble */}
                        <div
                          style={{
                            ...styles.messageBubble,
                            ...(message.isError
                              ? styles.errorMessage
                              : styles.assistantMessage),
                          }}
                        >
                          <div>{formatMessage(message.content)}</div>
                        </div>

                        {/* Calendar Cards */}
                        {message.calendarData &&
                          renderCalendarCards(message.calendarData)}

                        {/* Suggestions */}
                        {message.suggestions && (
                          <div style={styles.suggestions}>
                            {message.suggestions.map((suggestion, idx) => (
                              <button
                                key={idx}
                                onClick={() => sendMessage(suggestion)}
                                style={styles.suggestionButton}
                                onMouseOver={(e) => {
                                  e.target.style.backgroundColor = "#f8fafc";
                                  e.target.style.borderColor = "#4f46e5";
                                }}
                                onMouseOut={(e) => {
                                  e.target.style.backgroundColor = "white";
                                  e.target.style.borderColor = "#e2e8f0";
                                }}
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Timestamp */}
                        <div style={styles.timestamp}>
                          {formatTimestamp(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {isTyping && (
                <div style={styles.messageContainer}>
                  <div style={{ ...styles.avatar, ...styles.assistantAvatar }}>
                    <img
                      src="/zipsense-logo.png"
                      alt="Zipsense AI"
                      style={{
                        width: "20px",
                        height: "20px",
                        objectFit: "contain",
                      }}
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "block";
                      }}
                    />
                    <span style={{ display: "none", fontSize: "0.7rem" }}>
                      AI
                    </span>
                  </div>
                  <div style={styles.messageContent}>
                    <div style={styles.typingIndicator}>
                      <div style={styles.spinner}></div>
                      <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
                        AI is analyzing...
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          {showOverlay && (
            <div style={styles.overlay}>
              <div style={styles.overlayHeader}>
                <h3 style={styles.overlayTitle}>Strategy</h3>
                <button
                  style={styles.closeButton}
                  onClick={() => {
                    setShowOverlay(false);
                    setGenerationStatus("idle");
                  }}
                  onMouseOver={(e) =>
                    (e.target.style.backgroundColor = "#e2e8f0")
                  }
                  onMouseOut={(e) =>
                    (e.target.style.backgroundColor = "#f1f5f9")
                  }
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4l8 8M12 4l-8 8"
                    />
                  </svg>
                </button>
              </div>
              <div style={styles.overlayContent}>
                {generationStatus === "loading" && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "3rem 1rem",
                      gap: "1rem",
                    }}
                  >
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        border: "3px solid #e2e8f0",
                        borderTop: "3px solid #4f46e5",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                      }}
                    ></div>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        color: "#64748b",
                        margin: 0,
                      }}
                    >
                      Generating campaign strategy...
                    </p>
                  </div>
                )}
                {generationStatus === "error" && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "3rem 1rem",
                      gap: "1rem",
                    }}
                  >
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        backgroundColor: "#fef2f2",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.5rem",
                      }}
                    >
                      ⚠️
                    </div>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        color: "#dc2626",
                        margin: 0,
                        textAlign: "center",
                      }}
                    >
                      Failed to generate campaign strategy. Please try again.
                    </p>
                    <button
                      style={{
                        backgroundColor: "#4f46e5",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        padding: "0.5rem 1rem",
                        fontSize: "0.8rem",
                        fontWeight: "500",
                        cursor: "pointer",
                        marginTop: "0.5rem",
                      }}
                      onClick={() => generateCampaignContent(selectedCampaign)}
                      onMouseOver={(e) =>
                        (e.target.style.backgroundColor = "#4338ca")
                      }
                      onMouseOut={(e) =>
                        (e.target.style.backgroundColor = "#4f46e5")
                      }
                    >
                      Retry
                    </button>
                  </div>
                )}
                {generationStatus === "success" && strategyDoc && (
                  <div style={{ fontSize: "0.85rem" }}>
                    <div style={{ marginBottom: "1.5rem" }}>
                      <h4
                        style={{
                          fontSize: "1.1rem",
                          fontWeight: "600",
                          color: "black",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          marginBottom: "0.5rem",
                        }}
                      >
                       {selectedCampaign.campaign_name}
                      </h4>
                    </div>

                    <div style={{ marginBottom: "1.5rem" }}>
                      <h4
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: "600",
                          color: "#64748b",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          marginBottom: "0.5rem",
                        }}
                      >
                        Campaign Summary
                      </h4>
                      <p
                        style={{
                          color: "#1e293b",
                          lineHeight: "1.6",
                          margin: 0,
                        }}
                      >
                        {strategyDoc.content.campaign_strategy.campaign_summary}
                      </p>
                    </div>

                    {/* Primary Objective */}
                    <div style={{ marginBottom: "1.5rem" }}>
                      <h4
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: "600",
                          color: "#64748b",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          marginBottom: "0.5rem",
                        }}
                      >
                        Primary Objective
                      </h4>
                      <p
                        style={{
                          color: "#1e293b",
                          lineHeight: "1.6",
                          margin: 0,
                        }}
                      >
                        {
                          strategyDoc.content.campaign_strategy
                            .primary_objective
                        }
                      </p>
                    </div>

                    {/* Target Segment */}
                    <div style={{ marginBottom: "1.5rem" }}>
                      <h4
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: "600",
                          color: "#64748b",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          marginBottom: "0.5rem",
                        }}
                      >
                        Target Segment
                      </h4>
                      <p
                        style={{
                          color: "#1e293b",
                          lineHeight: "1.6",
                          margin: 0,
                        }}
                      >
                        {strategyDoc.content.campaign_strategy.target_segment}
                      </p>
                    </div>

                    {/* Key Messaging */}
                    <div style={{ marginBottom: "1.5rem" }}>
                      <h4
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: "600",
                          color: "#64748b",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          marginBottom: "0.5rem",
                        }}
                      >
                        Key Messaging
                      </h4>
                      <p
                        style={{
                          color: "#1e293b",
                          lineHeight: "1.6",
                          margin: 0,
                        }}
                      >
                        {strategyDoc.content.campaign_strategy.key_messaging}
                      </p>
                    </div>

                    {/* Content Blocks */}
                    <div>
                      <h4
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: "600",
                          color: "#64748b",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          marginBottom: "0.75rem",
                        }}
                      >
                        Email Content Blocks
                      </h4>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.75rem",
                        }}
                      >
                        {strategyDoc.content.campaign_strategy.blocks.map(
                          (block, index) => (
                            <div
                              key={index}
                              style={{
                                backgroundColor: "#f8fafc",
                                border: "1px solid #e2e8f0",
                                borderRadius: "8px",
                                padding: "0.75rem",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  marginBottom: "0.5rem",
                                }}
                              >
                                <span
                                  style={{
                                    fontSize: "0.7rem",
                                    fontWeight: "600",
                                    color: "#4f46e5",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.5px",
                                  }}
                                >
                                  {block.block_type.replace(/_/g, " ")}
                                </span>
                                <span
                                  style={{
                                    fontSize: "0.65rem",
                                    color: "#64748b",
                                    backgroundColor: "white",
                                    padding: "0.2rem 0.5rem",
                                    borderRadius: "12px",
                                    border: "1px solid #e2e8f0",
                                  }}
                                >
                                  Block {block.order}
                                </span>
                              </div>
                              <p
                                style={{
                                  fontSize: "0.75rem",
                                  color: "#475569",
                                  lineHeight: "1.5",
                                  margin: "0 0 0.5rem 0",
                                }}
                              >
                                {block.indicative_content}
                              </p>
                              {block.redirection_url && (
                                <a
                                  href={block.redirection_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    fontSize: "0.7rem",
                                    color: "#4f46e5",
                                    textDecoration: "none",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.25rem",
                                  }}
                                  onMouseOver={(e) =>
                                    (e.target.style.textDecoration =
                                      "underline")
                                  }
                                  onMouseOut={(e) =>
                                    (e.target.style.textDecoration = "none")
                                  }
                                >
                                  🔗 {block.redirection_url}
                                </a>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* Generate Email Button */}
                    <div
                      style={{
                        marginTop: "1.5rem",
                        paddingTop: "1rem",
                        borderTop: "1px solid #e2e8f0",
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      <button
                        style={{
                          backgroundColor: "#4f46e5",
                          color: "white",
                          border: "none",
                          borderRadius: "8px",
                          padding: "0.75rem 1.5rem",
                          fontSize: "0.85rem",
                          fontWeight: "600",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          transition: "all 0.2s",
                          boxShadow: "0 2px 4px rgba(79, 70, 229, 0.2)",
                        }}
                        onMouseOver={(e) => {
                          e.target.style.backgroundColor = "#4338ca";
                          e.target.style.transform = "translateY(-1px)";
                          e.target.style.boxShadow =
                            "0 4px 8px rgba(79, 70, 229, 0.3)";
                        }}
                        onMouseOut={(e) => {
                          e.target.style.backgroundColor = "#4f46e5";
                          e.target.style.transform = "translateY(0)";
                          e.target.style.boxShadow =
                            "0 2px 4px rgba(79, 70, 229, 0.2)";
                        }}
                        onClick={() => {
                          console.log(
                            "Generate email for campaign:",
                            selectedCampaign
                          );
                          // Add your generate email logic here
                        }}
                      >
                        <span>✨</span>
                        Generate Email
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
