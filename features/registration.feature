Feature: User can register for an account
    As a User
    I want to register for an account
    So that I can control my car using the app

    Scenario: User added to registered users
        Given I am not already registered
        When I sign up
        Then I have a registered account