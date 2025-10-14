import React, { useState, useRef, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:3001";

function App() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("connected");
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("1");
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const outputEndRef = useRef(null);

  const COLORS = [
    "#1F77B4",
    "#FF7F0E",
    "#2CA02C",
    "#D62728",
    "#9467BD",
    "#17BECF",
    "#8C564B",
    "#BCBD22",
  ];

  const quickActions = [
    "Show me the top 5 performing campaigns",
    "Plot open rates for all campaigns",
    "Compare click rates across campaigns",
    "Show me top performing flows",
    "Compare flow performance across metrics",
    "Compare campaigns vs flows performance",
    "Show flow revenue trends over time",
    "Which campaigns had the best engagement?",
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
      fontSize: "1.2rem",
    },
    title: {
      fontSize: "1.1rem",
      fontWeight: "600",
      margin: 0,
      color: "#1e293b",
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
    mainContent: {
      display: "flex",
      flex: 1,
      overflow: "hidden",
    },
    leftSection: {
      width: "33.3",
      minWidth: "33.3%",
      maxWidth: "33.3%",
      borderRight: "1px solid #e2e8f0",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    },
    rightSection: {
      width: "66.7%",
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
    messagesArea: {
      flex: 1,
      overflowY: "auto",
      padding: "1rem",
      background: "rgba(248, 250, 252, 0.3)",
    },
    messageContainer: {
      display: "flex",
      gap: "0.6rem",
      marginBottom: "1rem",
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
    },
    messageContent: {
      maxWidth: "80%",
      minWidth: 0,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    },
    messageBubble: {
      padding: "0.8rem 1rem",
      borderRadius: "12px",
      fontSize: "0.8rem",
      lineHeight: "1.4",
      wordWrap: "break-word",
      wordBreak: "break-word",
      overflowWrap: "break-word",
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
    inputArea: {
      borderTop: "1px solid #e2e8f0",
      backgroundColor: "white",
      padding: "1rem",
    },
    inputForm: {
      display: "flex",
      alignItems: "center",
      gap: "0.8rem",
      height: "40px",
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
      minHeight: "40px",
      maxHeight: "40px",
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
    quickActionsGrid: {
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
      marginBottom: "0.8rem",
    },
    quickActionButton: {
      textAlign: "left",
      padding: "0.75rem 1rem",
      fontSize: "0.85rem",
      backgroundColor: "#f8fafc",
      border: "1px solid #e2e8f0",
      borderRadius: "8px",
      cursor: "pointer",
      transition: "all 0.2s",
      width: "100%",
    },
    outputArea: {
      flex: 1,
      overflowY: "auto",
      padding: "1rem",
      background: "rgba(248, 250, 252, 0.3)",
    },
    outputCard: {
      backgroundColor: "white",
      border: "1px solid #e2e8f0",
      borderRadius: "12px",
      padding: "1rem",
      marginBottom: "1rem",
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    },
    chartContainer: {
      marginTop: "1rem",
      padding: "1rem",
      backgroundColor: "#f8fafc",
      borderRadius: "8px",
      border: "1px solid #e2e8f0",
    },
    chartTitle: {
      fontSize: "0.85rem",
      fontWeight: "600",
      color: "#1e293b",
      marginBottom: "0.75rem",
    },
    quickActionToggle: {
      width: "40px",
      height: "40px",
      minHeight: "40px",
      maxHeight: "40px",
      backgroundColor: "#f1f5f9",
      border: "none",
      borderRadius: "8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      transition: "background-color 0.2s",
      flexShrink: 0,
    },
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    fetchBrands();
    checkConnection();
  }, []);

  useEffect(() => {
    if (brands.length > 0 && !sessionId) {
      initializeSession(selectedBrand);
    }
  }, [brands]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const checkConnection = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/health`);
      setConnectionStatus(response.ok ? "connected" : "disconnected");
    } catch (error) {
      setConnectionStatus("disconnected");
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
        setMessages([
          {
            type: "assistant",
            content: data.greeting,
            timestamp: new Date(),
          },
        ]);
      }
    } catch (error) {
      console.error("Failed to initialize session:", error);
      setConnectionStatus("disconnected");
      setMessages([
        {
          type: "assistant",
          content:
            "I'm having trouble connecting. Please check that the backend server is running.",
          timestamp: new Date(),
          isError: true,
        },
      ]);
    }
  };

  useEffect(() => {
    const hasNewOutput = messages.some(
      (msg, index) =>
        msg.type === "assistant" && index > 0 && !msg.content.includes("?")
    );

    if (hasNewOutput) {
      outputEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleBrandChange = async (brandKey) => {
    setSelectedBrand(brandKey);
    setMessages([]);
    await initializeSession(brandKey);
  };

  const parseChartData = (content) => {
    try {
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        const data = JSON.parse(jsonMatch[1]);
        return data;
      }
      return null;
    } catch (error) {
      console.error("Failed to parse chart data:", error);
      return null;
    }
  };

  const cleanContentForChart = (content) => {
    return content.replace(/```json\s*[\s\S]*?\s*```/g, "").trim();
  };

  const renderChart = (chartData) => {
    if (!chartData || !chartData.type || !chartData.data) return null;

    const commonProps = {
      width: "100%",
      height: 300,
    };

    switch (chartData.type) {
      case "line":
        return (
          <ResponsiveContainer {...commonProps}>
            <LineChart
              data={chartData.data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey={chartData.xKey || "name"}
                tick={{ fontSize: 12 }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              {chartData.lines?.map((line, idx) => (
                <Line
                  key={idx}
                  type="monotone"
                  dataKey={line.key}
                  stroke={COLORS[idx % COLORS.length]}
                  strokeWidth={2}
                  name={line.name || line.key}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );

      case "bar":
        return (
          <ResponsiveContainer {...commonProps}>
            <BarChart
              data={chartData.data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e2e8f0"
                vertical={false}
              />
              <XAxis
                dataKey={chartData.xKey || "name"}
                tick={{ fontSize: 10 }}
              />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Legend />
              {chartData.bars?.map((bar, idx) => (
                <Bar
                  key={idx}
                  dataKey={bar.key}
                  barSize={25}
                  fill={COLORS[idx % COLORS.length]}
                  name={bar.name || bar.key}
                  radius={[6, 6, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );

      case "pie":
        return (
          <ResponsiveContainer {...commonProps}>
            <PieChart>
              <Pie
                data={chartData.data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey={chartData.valueKey || "value"}
              >
                {chartData.data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
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

    try {
      const response = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, message: textToSend }),
      });

      const data = await response.json();

      if (data.status === "success") {
        const chartData = parseChartData(data.response);
        const displayContent = chartData
          ? cleanContentForChart(data.response)
          : data.response;

        setMessages((prev) => [
          ...prev,
          {
            type: "assistant",
            content: displayContent,
            timestamp: new Date(),
            chartData: chartData,
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
          content: "I encountered an issue. Please try again.",
          timestamp: new Date(),
          isError: true,
        },
      ]);
      setConnectionStatus("disconnected");
    } finally {
      setIsLoading(false);
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
      let formattedLine = line;

      // Handle headers
      if (line.startsWith("### ")) {
        formattedLine = `<h3 style="font-size: 0.95rem; font-weight: 600; color: #1e293b; margin: 0.75rem 0 0.4rem 0;">${line.replace(
          "### ",
          ""
        )}</h3>`;
      } else if (line.startsWith("## ")) {
        formattedLine = `<h2 style="font-size: 1rem; font-weight: 600; color: #1e293b; margin: 0.85rem 0 0.5rem 0;">${line.replace(
          "## ",
          ""
        )}</h2>`;
      } else if (line.startsWith("# ")) {
        formattedLine = `<h1 style="font-size: 1.1rem; font-weight: 600; color: #1e293b; margin: 1rem 0 0.6rem 0;">${line.replace(
          "# ",
          ""
        )}</h1>`;
      }
      // Handle bold
      else {
        formattedLine = line.replace(
          /\*\*(.*?)\*\*/g,
          "<strong style='font-weight: 600; color: #1e293b;'>$1</strong>"
        );
      }

      // Handle italic
      formattedLine = formattedLine.replace(
        /\*(.*?)\*/g,
        "<em style='font-style: italic;'>$1</em>"
      );

      // Handle inline code
      formattedLine = formattedLine.replace(
        /`(.*?)`/g,
        "<code style='background-color: #f1f5f9; padding: 0.15rem 0.35rem; border-radius: 3px; font-size: 0.85em; font-family: monospace;'>$1</code>"
      );

      // Handle bullet points
      if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
        formattedLine = `<li style="margin-left: 1.25rem; margin-bottom: 0.25rem; color: #475569;">${formattedLine.replace(
          /^[\-\*]\s+/,
          ""
        )}</li>`;
      }

      // Handle numbered lists
      if (/^\d+\.\s/.test(line.trim())) {
        formattedLine = `<li style="margin-left: 1.25rem; margin-bottom: 0.25rem; color: #475569; list-style-type: decimal;">${formattedLine.replace(
          /^\d+\.\s+/,
          ""
        )}</li>`;
      }

      // Handle blockquotes
      if (line.trim().startsWith("> ")) {
        formattedLine = `<blockquote style="border-left: 3px solid #8b5cf6; padding-left: 0.75rem; margin: 0.5rem 0; color: #64748b; font-style: italic;">${line.replace(
          "> ",
          ""
        )}</blockquote>`;
      }

      // Handle horizontal rules
      if (line.trim() === "---" || line.trim() === "***") {
        formattedLine = `<hr style="border: none; border-top: 1px solid #e2e8f0; margin: 0.75rem 0;" />`;
      }

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
        `}
      </style>

      <div style={styles.chatContainer}>
        {/* Header */}
        <header style={styles.header}>
          <div style={styles.headerContent}>
            <div style={styles.headerLeft}>
              <div style={styles.icon}>📊</div>
              <div>
                <h1 style={styles.title}>Zipsense Analytics</h1>
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

        {/* Main Content */}
        <div style={styles.mainContent}>
          {/* Left Section - Chat */}
          <div style={styles.leftSection}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Chat</h2>
            </div>

            <div style={styles.messagesArea}>
              {messages.map((message, index) => {
                // Check if it's the welcome message (first assistant message)
                const isWelcomeMessage =
                  index === 0 && message.type === "assistant";
                const hasQuestionMark =
                  message.content && message.content.includes("?");

                // Show in chat: all user messages, welcome message, or assistant messages with ?
                const shouldShowInChat =
                  message.type === "user" ||
                  isWelcomeMessage ||
                  (message.type === "assistant" && hasQuestionMark);

                // Skip if shouldn't show in chat
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
                    <div
                      style={{
                        ...styles.avatar,
                        ...(message.type === "user"
                          ? styles.userAvatar
                          : styles.assistantAvatar),
                        order: message.type === "user" ? 2 : 1,
                      }}
                    >
                      {message.type === "user" ? "You" : "AI"}
                    </div>
                    <div
                      style={{
                        ...styles.messageContent,
                        order: message.type === "user" ? 1 : 2,
                      }}
                    >
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
                        {formatMessage(message.content)}
                      </div>
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

              {isLoading && (
                <div style={styles.messageContainer}>
                  <div style={{ ...styles.avatar, ...styles.assistantAvatar }}>
                    AI
                  </div>
                  <div style={styles.messageContent}>
                    <div style={styles.typingIndicator}>
                      <div style={styles.spinner}></div>
                      <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
                        Analyzing...
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div style={styles.inputArea}>
              {showQuickActions && (
                <div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#64748b",
                      fontWeight: "500",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Quick Actions:
                  </div>
                  <div style={styles.quickActionsGrid}>
                    {quickActions.map((action, idx) => (
                      <button
                        key={idx}
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

              <div style={styles.inputForm}>
                {/* Thunder bolt button */}
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
                    placeholder="Ask about analytics.."
                    style={styles.textarea}
                    rows={1}
                    disabled={isLoading}
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
            </div>
          </div>

          {/* Right Section - Output */}
          <div style={styles.rightSection}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Output & Visualizations</h2>
            </div>

            <div style={styles.outputArea}>
              {messages
                .filter((msg, index) => {
                  const isWelcomeMessage = index === 0;
                  const hasQuestionMark =
                    msg.content && msg.content.includes("?");
                  return (
                    msg.type === "assistant" &&
                    !isWelcomeMessage &&
                    !hasQuestionMark
                  );
                })
                .map((message, index) => (
                  <div key={index} style={styles.outputCard}>
                    <div
                      style={{
                        fontSize: "0.8rem",
                        lineHeight: "1.4",
                        color: "#1e293b",
                      }}
                    >
                      {formatMessage(message.content)}
                    </div>

                    {message.chartData && (
                      <div style={styles.chartContainer}>
                        <h4 style={styles.chartTitle}>
                          {message.chartData.title || "Data Visualization"}
                        </h4>
                        {renderChart(message.chartData)}
                      </div>
                    )}
                  </div>
                ))}

              <div ref={outputEndRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
