const Notification = ({ notification }) => {
  return (
    <div className={notification.class==="success" ? "success" : "error"}>
      {notification.message}
    </div>
  )
}

export default Notification