PGDMP  %    /                |            Invoice    16.3    16.3     �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    49475    Invoice    DATABASE     �   CREATE DATABASE "Invoice" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_Indonesia.1252';
    DROP DATABASE "Invoice";
                postgres    false            �            1259    49503    invoice_products    TABLE     �   CREATE TABLE public.invoice_products (
    invoice_id integer NOT NULL,
    product_id integer NOT NULL,
    quantity integer NOT NULL
);
 $   DROP TABLE public.invoice_products;
       public         heap    postgres    false            �            1259    49495    invoices    TABLE     �   CREATE TABLE public.invoices (
    invoice_id integer NOT NULL,
    date date NOT NULL,
    customer_name character varying(255) NOT NULL,
    salesperson_name character varying(255) NOT NULL,
    notes text
);
    DROP TABLE public.invoices;
       public         heap    postgres    false            �            1259    49494    invoices_invoice_id_seq    SEQUENCE     �   CREATE SEQUENCE public.invoices_invoice_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.invoices_invoice_id_seq;
       public          postgres    false    218            �           0    0    invoices_invoice_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.invoices_invoice_id_seq OWNED BY public.invoices.invoice_id;
          public          postgres    false    217            �            1259    49486    products    TABLE     �   CREATE TABLE public.products (
    product_id integer NOT NULL,
    name character varying(255) NOT NULL,
    picture text,
    stock integer NOT NULL,
    price numeric(10,2) NOT NULL
);
    DROP TABLE public.products;
       public         heap    postgres    false            �            1259    49485    products_product_id_seq    SEQUENCE     �   CREATE SEQUENCE public.products_product_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.products_product_id_seq;
       public          postgres    false    216            �           0    0    products_product_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.products_product_id_seq OWNED BY public.products.product_id;
          public          postgres    false    215            Z           2604    49498    invoices invoice_id    DEFAULT     z   ALTER TABLE ONLY public.invoices ALTER COLUMN invoice_id SET DEFAULT nextval('public.invoices_invoice_id_seq'::regclass);
 B   ALTER TABLE public.invoices ALTER COLUMN invoice_id DROP DEFAULT;
       public          postgres    false    217    218    218            Y           2604    49489    products product_id    DEFAULT     z   ALTER TABLE ONLY public.products ALTER COLUMN product_id SET DEFAULT nextval('public.products_product_id_seq'::regclass);
 B   ALTER TABLE public.products ALTER COLUMN product_id DROP DEFAULT;
       public          postgres    false    216    215    216            `           2606    49507 &   invoice_products invoice_products_pkey 
   CONSTRAINT     x   ALTER TABLE ONLY public.invoice_products
    ADD CONSTRAINT invoice_products_pkey PRIMARY KEY (invoice_id, product_id);
 P   ALTER TABLE ONLY public.invoice_products DROP CONSTRAINT invoice_products_pkey;
       public            postgres    false    219    219            ^           2606    49502    invoices invoices_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_pkey PRIMARY KEY (invoice_id);
 @   ALTER TABLE ONLY public.invoices DROP CONSTRAINT invoices_pkey;
       public            postgres    false    218            \           2606    49493    products products_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (product_id);
 @   ALTER TABLE ONLY public.products DROP CONSTRAINT products_pkey;
       public            postgres    false    216            a           2606    49508 1   invoice_products invoice_products_invoice_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.invoice_products
    ADD CONSTRAINT invoice_products_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.invoices(invoice_id) ON DELETE CASCADE;
 [   ALTER TABLE ONLY public.invoice_products DROP CONSTRAINT invoice_products_invoice_id_fkey;
       public          postgres    false    218    4702    219            b           2606    49513 1   invoice_products invoice_products_product_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.invoice_products
    ADD CONSTRAINT invoice_products_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(product_id) ON DELETE CASCADE;
 [   ALTER TABLE ONLY public.invoice_products DROP CONSTRAINT invoice_products_product_id_fkey;
       public          postgres    false    4700    216    219           