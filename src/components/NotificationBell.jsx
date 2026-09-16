import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  IoCheckmarkDoneCircleOutline,
  IoCalendarOutline,
  IoHomeOutline,
  IoDocumentTextOutline,
  IoCashOutline,
  IoTimeOutline,
  IoAlertCircleOutline,
  IoCheckmarkDoneOutline,
  IoNotificationsOutline,
} from "react-icons/io5";
import {
  buildNotifications,
  getReadNotifIds,
  markNotifRead,
  markAllNotifsRead,
} from "../utils/notifications";

const ICONS = {
  app: IoCheckmarkDoneCircleOutline,
  interview: IoCalendarOutline,
  room: IoHomeOutline,
  lease: IoDocumentTextOutline,
  pay: IoCashOutline,
  expiry: IoTimeOutline,
  ext: IoDocumentTextOutline,
  step: IoAlertCircleOutline,
  welcome: IoCheckmarkDoneOutline,
};

const BELL_PATH =
  "M26.25 8.12501C26.25 10.5375 24.2875 12.5 21.875 12.5C19.4625 12.5 17.5 10.5375 17.5 8.12501C17.5 5.71251 19.4625 3.75001 21.875 3.75001C24.2875 3.75001 26.25 5.71251 26.25 8.12501ZM23.75 14.7375C23.125 14.9 22.5 15 21.875 15C20.0527 14.9967 18.3059 14.2713 17.0173 12.9827C15.7287 11.6941 15.0033 9.94735 15 8.12501C15 6.28751 15.725 4.62501 16.875 3.38751C16.6482 3.10943 16.3621 2.88547 16.0378 2.73194C15.7134 2.5784 15.3589 2.49917 15 2.50001C13.625 2.50001 12.5 3.62501 12.5 5.00001V5.36251C8.7875 6.46251 6.25 9.87501 6.25 13.75V21.25L3.75 23.75V25H26.25V23.75L23.75 21.25V14.7375ZM15 28.75C16.3875 28.75 17.5 27.6375 17.5 26.25H12.5C12.5 26.913 12.7634 27.5489 13.2322 28.0178C13.7011 28.4866 14.337 28.75 15 28.75Z";

export default function NotificationBell({ client }) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, right: 8 });
  const [readIds, setReadIds] = useState(() => getReadNotifIds());
  const bellRef = useRef(null);
  const ddRef = useRef(null);

  const notifications = useMemo(() => {
    try {
      return buildNotifications({ client }) || [];
    } catch {
      return [];
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client]);

  const unread = notifications.filter((n) => !readIds.includes(n.id));

  const toggle = () => {
    if (!open) {
      const r = bellRef.current?.getBoundingClientRect();
      if (r) {
        setPosition({
          top: r.bottom + 10,
          right: Math.max(8, window.innerWidth - r.right),
        });
      }
    }
    setOpen((o) => !o);
  };

  // Close when clicking outside (trigger wrapper OR the portaled dropdown itself)
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event) => {
      if (
        bellRef.current &&
        !bellRef.current.contains(event.target) &&
        !ddRef.current?.contains(event.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const openNotification = (notif) => {
    markNotifRead(notif.id);
    setReadIds(getReadNotifIds());
    setOpen(false);
  };

  const handleMarkAll = () => {
    markAllNotifsRead(notifications.map((n) => n.id));
    setReadIds(getReadNotifIds());
  };

  return (
    <>
      <div className="user-profile new-iconset notif-wrapper" ref={bellRef}>
        <button type="button" className="notif-btn" onClick={toggle} aria-label="Notifications" aria-expanded={open}>
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d={BELL_PATH} fill="white" />
          </svg>
          {unread.length > 0 && (
            <span className="notif-badge">{unread.length > 99 ? "99+" : unread.length}</span>
          )}
        </button>
      </div>

      {createPortal(
        <div
          className={`notif-dropdown ${open ? "active" : ""}`}
          ref={ddRef}
          style={{ top: position.top, right: position.right }}
          role="dialog"
          aria-label="Notifications"
        >
          <div className="notif-head">
            <div>
              <span className="notif-head-title">Notifications</span>
              {unread.length > 0 && (
                <span className="notif-head-sub">{unread.length} unread</span>
              )}
            </div>
            {unread.length > 0 && (
              <button type="button" className="notif-mark-all" onClick={handleMarkAll}>
                Mark all as read
              </button>
            )}
          </div>

          {notifications.length ? (
            <ul className="notif-list">
              {notifications.map((n) => {
                const Icon = ICONS[n.icon] || IoNotificationsOutline;
                const isUnread = !readIds.includes(n.id);
                return (
                  <li
                    key={n.id}
                    className={`notif-item ${isUnread ? "unread" : ""}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => openNotification(n)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        openNotification(n);
                      }
                    }}
                  >
                    <span className={`notif-icon ${n.kind}`}><Icon /></span>
                    <span className="notif-item-body">
                      <span className="notif-item-title">{n.title}</span>
                      <span className="notif-item-msg">{n.message}</span>
                      <span className="notif-item-time">{n.time || "Just now"}</span>
                    </span>
                    {isUnread && <span className="notif-unread-dot" />}
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="notif-empty">
              <IoNotificationsOutline size={26} />
              <p>No notifications yet</p>
            </div>
          )}
        </div>,
        document.body
      )}
    </>
  );
}