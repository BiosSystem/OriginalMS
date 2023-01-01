package net.login;

public interface LoginServerMBean {

    int getNumberOfSessions();

    int getLoginInterval();

    int getUserLimit();

    void setUserLimit(int newLimit);
}
